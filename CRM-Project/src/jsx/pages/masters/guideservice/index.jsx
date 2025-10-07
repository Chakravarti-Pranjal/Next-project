import React, { useState, useEffect, useRef } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav, Button } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import {
  guideServiceMasterInititalValue,
  guideServiceRateInitialValue,
} from "../masters_initial_value";
import {
  gudieServiceRateValidationSchema,
  guideServiceValidationSchema,
} from "../master_validation";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import DatePicker from "react-datepicker";
import { guideServiceCostInitial } from "../masters_initial_value";
import { string } from "yup";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import zIndex from "@mui/material/styles/zIndex.js";
import Skeleton from "../../../layouts/Skeleton"

const GuideService = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(guideServiceMasterInititalValue);
  const [rateFormValue, setRateFormValue] = useState(
    guideServiceRateInitialValue
  );
  const [validationErrors, setValidationErrors] = useState({});
  const [destinationList, setDestintaionList] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const handlePageChange = (page) => setCurrentPage(page - 1);
  const [serviceCostForm, setServiceCostForm] = useState([
    guideServiceCostInitial,
  ]);
  const [supplierList, setSupplierList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [paxRangeList, setPaxRangeList] = useState([]);
  const [guideMasterList, setGuideMasterList] = useState([]);
  const [slabList, setSlabList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rateValidation, setRateValidation] = useState({});
  const [rateInitialList, setRateInitialList] = useState([]);
  const [destinationlist, setdestinationlist] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectguidename, setselectguidename] = useState("");
  const [selectservicetype, setSelectservicetype] = useState("")
  const [isLoading, setIsLoading] = useState(true);
  const [totalPage, setTotalPage] = useState("");
  const { state } = useLocation();

  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  // const getListDataToServer = async () => {
  //   try {
  //     const { data } = await axiosOther.post("guideservicelist");
  //     setInitialList(data?.DataList);
  //     setFilterValue(data?.DataList);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };
  const getListDataToServer = async () => {
    try {
      setIsLoading(true);
      try {
        const states =
          state?.selectedDestination?.value === "all"
            ? " "
            : state?.selectedDestination;
        // const servicename = state?.selectguidename
        // console.log(servicename, "servicename")

        const { data } = await axiosOther.post("guideservicelist", {
          ServiceName: state?.selectguidename,
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
        setselectguidename(state?.selectguidename);


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

  const getDataForDropdown = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist");
      setDestintaionList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("service-list", initialList);

  useEffect(() => {
    getDataForDropdown();
  }, []);

  useEffect(() => {
    getListDataToServer();
  }, []);

  // handlign form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await guideServiceValidationSchema.validate(formValue, {
  //       abortEarly: false,
  //     });
  //     setValidationErrors({});
  //     const { data } = await axiosOther.post("addupdateguideservice", {
  //       ...formValue,
  //       ServiceCost: serviceCostForm,
  //     });

  //     // console.log("guide-data", data);
  //     if (data?.Status == 1 || data?.status == 1) {
  //       getListDataToServer();
  //       setIsEditing(false);
  //       // setFormValue(guideServiceMasterInititalValue);
  //       // notifySuccess(data?.message || data?.Message);
  //       try {
  //         await gudieServiceRateValidationSchema.validate(
  //           {
  //             ...rateFormValue,
  //             GuideId: data?.Id,
  //           },
  //           { abortEarly: false }
  //         );

  //         setRateValidation({});
  //         const rateResp = await axiosOther.post(
  //           isUpdating ? "updateguideratejson" : "addupdateguiderate",
  //           {
  //             ...rateFormValue,
  //             ServiceCost: serviceCostForm,
  //             id: data?.Id,
  //             DestinationID: parseInt(formValue?.Destination),
  //           }
  //         );

  //         if (rateResp?.data?.Status == 1 || rateResp?.data?.status == 1) {
  //           // setIsUpdating(false);
  //           // getDataToServer();
  //           // setDataForUpdate("");
  //           // navigate(-1)
  //           setIsUpdating(false);
  //           setIsEditing(false);
  //           getListDataToServer();
  //           notifySuccess("Guide and rate updated successfully !");
  //           setRateFormValue(guideServiceRateInitialValue);
  //           setServiceCostForm([guideServiceCostInitial]);
  //           setFormValue(guideServiceMasterInititalValue);
  //         }

  //         if (rateResp?.data?.Status == 0 || rateResp?.data?.status == 0) {
  //           notifyError(rateResp?.data?.message || rateResp?.data?.Message);
  //         }
  //       } catch (error) {
  //         if (error.inner) {
  //           const errorMessages = error.inner.reduce((acc, curr) => {
  //             acc[curr.path] = curr.message;
  //             return acc;
  //           }, {});
  //           setRateValidation(errorMessages);
  //         }

  //         if (error.response?.data?.Errors) {
  //           const data = Object.entries(error.response?.data?.Errors);
  //           alert(data[0][1]);
  //         }

  //         console.log("error", error);
  //       }
  //     } else {
  //       notifyError(data?.message || data?.Message);
  //     }
  //   } catch (error) {
  //     if (error.inner) {
  //       const validationErrorss = error.inner.reduce((acc, curr) => {
  //         acc[curr.path] = curr.message;
  //         return acc;
  //       }, {});
  //       setValidationErrors(validationErrorss);
  //     }
  //     if (error.response?.data?.Errors) {
  //       const data = Object.entries(error.response?.data?.Errors);
  //       notifyError(data[0][1]);
  //     }
  //   }
  // };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     // Validate the guide service form
  //     await guideServiceValidationSchema.validate(formValue, {
  //       abortEarly: false,
  //     });
  //     setValidationErrors({});


  //     // Call the addupdateguideservice API
  //     const { data } = await axiosOther.post("addupdateguideservice", {
  //       ...formValue,
  //     });

  //     console.log(data);

  //     console.log(temp);


  //     if (data?.Status == 1 || data?.status == 1) {
  //       notifySuccess(data?.Message || "Guide service added successfully!");


  //       const guideIds = data?.Guide_Ids || [];
  //       const destinationIds = data?.Destination_Id || [];



  //       // if (guideIds.length !== destinationIds.length) {
  //       //   throw new Error("Mismatch between Guide_Ids and Destination_Id arrays");
  //       // }


  //       for (let i = 0; i < destinationIds.length; i++) {
  //         const destinationId = destinationIds[i];
  //         const guideId = guideIds[i];
  //         const destination = destinationList.find(d => d.id === destinationId);

  //         const ratePayload = {
  //           ...rateFormValue,
  //           id: guideId,
  //           ServiceCost: serviceCostForm,
  //           DestinationID: destinationId,
  //         };

  //         console.log("Rate Payload for Destination & Guide:", ratePayload);

  //         ratePayload.DestinationID = String(ratePayload.DestinationID);

  //         await axiosOther.post("addupdateguiderate", ratePayload);
  //       }

  //       // Reset the form and refresh the list
  //       setFormValue(guideServiceMasterInititalValue);
  //       setRateFormValue(guideServiceRateInitialValue);
  //       setServiceCostForm([guideServiceCostInitial]);
  //       getListDataToServer();
  //     } else {
  //       notifyError(data?.Message || "Failed to add guide service");
  //     }
  //   } catch (error) {
  //     console.error("Error in handleSubmit:", error);
  //     notifyError("An error occurred while processing your request");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate the guide service form
      await guideServiceValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});

      // Call the addupdateguideservice API
      const { data } = await axiosOther.post("addupdateguideservice", {
        ...formValue,
      });
      // console.log(formValue, "formvaluesagar")

      if (data?.Status == 1 || data?.status == 1) {
        notifySuccess(data?.Message || "Guide service added successfully!");

        const guideIds = data?.Guide_Ids || [];
        const destinationIds = data?.Destination_Id || [];

        // console.log("GUideID: ", guideIds?.length);
        // console.log("destinationIds: ", destinationIds?.length);



        if (formValue.Destination === "All") {
          // If "All" destinations selected, loop through all destinations
          for (let i = 0; i < destinationIds?.length; i++) {
            const ratePayload = {
              ...rateFormValue,
              id: guideIds[i], // Using the same guide ID for all
              ServiceCost: serviceCostForm,
              DestinationID: String(destinationIds[i]),
            };
            ratePayload.id = String(ratePayload.id);
            // console.log("firs", ratePayload)
            const { data } = await axiosOther.post("addupdateguiderate", ratePayload);
          }
        } else {
          // For single destination
          const ratePayload = {
            ...rateFormValue,
            id: guideIds,
            ServiceCost: serviceCostForm,
            DestinationID: formValue.Destination,
          };
          ratePayload.id = String(ratePayload.id);

          const { data } = await axiosOther.post("addupdateguiderate", ratePayload);
        }




        // Handle rate submission based on destination selection
        // if (formValue.Destination === "All") {
        //   // If "All" destinations selected, loop through all destinations
        //   for (const destinationIds of destinationList) {
        //     const ratePayload = {
        //       ...rateFormValue,
        //       id: guideIds, // Using the same guide ID for all
        //       ServiceCost: serviceCostForm,
        //       DestinationID: destinationIds,
        //     };
        //     ratePayload.id = String(ratePayload.id);
        //     console.log("firs", ratePayload)
        //     // await axiosOther.post("addupdateguiderate", ratePayload);
        //   }
        // } else {
        //   // For single destination
        //   const ratePayload = {
        //     ...rateFormValue,
        //     id: guideIds,
        //     ServiceCost: serviceCostForm,
        //     DestinationID: formValue.Destination,
        //   };
        //   ratePayload.id = String(ratePayload.id);

        //   await axiosOther.post("addupdateguiderate", ratePayload);
        // }

        // Reset the form and refresh the list
        setFormValue(guideServiceMasterInititalValue);
        setRateFormValue(guideServiceRateInitialValue);
        setServiceCostForm([guideServiceCostInitial]);
        getListDataToServer();
      } else {
        notifyError(data?.Message || "Failed to add guide service");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);

      // Handle validation errors
      if (error.inner) {
        const validationErrorss = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrorss);
      }

      notifyError("An error occurred while processing your request");
    }
  };

  const handleDelete = async (id) => {
    const confirmation = await swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmation) {
      try {
        const { data } = await axiosOther.post("guideservicedelete", {
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

  // const getRateListForEdit = async (id) => {
  //   try {
  //     const { data } = await axiosOther.post("guideservicelist", {
  //       id: id,
  //     });

  //     console.log("rate-list", data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleEdit = (data) => {
    // console.log("data", data);
    setFormValue({
      id: data?.id,
      ServiceType: data?.ServiceType,
      Destination: data?.Destination?.id,
      Guide_Porter_Service: data?.ServiceName,
      Default: data?.Default == "" ? "No" : data?.Default,
      Status: data?.Status == "Active" ? "1" : "0",
      AddedBy: data?.AddedBy,
      UpdatedBy: data?.UpdatedBy,
      CompanyId: "Debox-01",
    });
    setIsEditing(true);
    formRef.current.scrollIntoView({ behavior: "smooth" });

    if (data?.Ratejson) {
      let { Data } = data?.Ratejson;
      if (Data?.length > 0) {
        console.log("RATE-DATA", Data);
      }
    }
  };

  const handleReset = () => {
    setFormValue(guideServiceMasterInititalValue);
    setValidationErrors({});
    setIsEditing(false);
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

  const handleServiceIncrement = () => {
    setServiceCostForm((prevArr) => {
      let newForm = [...prevArr];
      newForm = [...newForm, guideServiceCostInitial];
      return newForm;
    });
  };

  const handleServiceDecrement = (ind) => {
    if (serviceCostForm?.length > 1) {
      const refForm = [...serviceCostForm];
      const filteredForm = refForm?.filter((_, index) => index != ind);
      setServiceCostForm(filteredForm);
    }
  };

  const handleServiceCostForm = (e, index) => {
    const { name, value } = e.target;
    setServiceCostForm((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = { ...newArr[index], [name]: value };
      return newArr;
    });
  };

  const hanldeRateFormChange = (e) => {
    const { name, value, file, type } = e.target;
    setRateFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // console.log(state, "state")
  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
      sortable: false,
      width: "4rem",
      style: {
        display: "flex",
        justifyContent: "center",
      },
    },
    {
      name: "Guide Service",
      selector: (row) => row?.ServiceName,
      cell: (row) => <span>{row?.ServiceName}{" "}
        {row?.Default == "Yes" && (
          <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
        )}</span>,
      sortable: true,
      // width: "10rem",
      wrap: true,
    },
    {
      name: "Destination",
      selector: (row) => row?.Destination?.Name,
      cell: (row) => <span>{row?.Destination?.Name}</span>,
      sortable: true,
      // width: "10rem",
      wrap: true,
    },
    {
      name: "Service Type",
      selector: (row) => row?.ServiceType,
      cell: (row) => <span>{row?.ServiceType}</span>,
      sortable: true,
      width: "10rem",
      wrap: true,
    },

    {
      name: "Rate Sheet",
      selector: (row) => (
        <NavLink
          to={`/guide-service/rate/${row?.id}`}
          state={{
            ...row,
            Master: row?.id,
            selectedDestination,
            selectguidename
          }}
        >
          <Button variant="dark light py-1 rounded-pill fontSize11px px-1">
            View/Add
          </Button>
        </NavLink>
      ),
      wrap: true,
      // minWidth: "100px",
      width: "7rem",
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
      width: "4.5rem",
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <span className="d-flex gap-1">
            <i
              className="fa-solid fa-pencil cursor-pointer text-success action-icon"
              onClick={() => handleEdit(row)}
            ></i>
            <i
              className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
              onClick={() => handleDelete(row?.id)}
            ></i>
          </span>
        );
      },
      width: "4.5rem",
    },
  ];

  const supplierApiList = async () => {
    try {
      const { data } = await axiosOther.post("supplierlist", {
        Name: "",
        id: "",
        SupplierService: [1],
        DestinationId: [parseInt(formValue?.Destination)],
      });
      setSupplierList(data.DataList);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (formValue?.Destination != "") {
      // console.log("working-here");
      supplierApiList();
    }
  }, [formValue?.Destination]);

  const postDropdownDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("currencymasterlist", {
        id: "",
        Name: "",
        Status: "",
      });
      setCurrencyList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("taxmasterlist", {
        Id: "",
        Search: "",
        Status: "",
      });
      setSlabList(data);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("tourescortmasterlist", {
        Search: "",
        Status: "",
      });
      setGuideMasterList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
    try {
      const { data } = await axiosOther.post("pax-range-list", {
        Search: "",
        Status: "",
      });
      setPaxRangeList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    postDropdownDataToServer();
  }, []);

  const getFromDate = () => {
    return rateFormValue?.ValidFrom ? new Date(rateFormValue?.ValidFrom) : null;
  };
  const getNextDate = () => {
    return rateFormValue?.ValidTo ? new Date(rateFormValue?.ValidTo) : null;
  };

  const handleNextCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").reverse().join("-")
      : "";
    setRateFormValue({
      ...rateFormValue,
      ValidTo: formattedDate,
    });
  };

  const handleCalender = (date) => {
    const formattedDate = date
      ? date.toLocaleDateString("en-GB").split("/").reverse().join("-")
      : "";
    setRateFormValue({
      ...rateFormValue,
      ValidFrom: formattedDate,
    });
  };

  const serviceRateList = async () => {
    try {
      const { data } = await axiosOther.post("guideservicelist", {
        id: id,
      });
      setRateInitialList(data?.DataList);
    } catch (error) {
      console.log(error);
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
          selectedDestination?.value === "all" ? " " : selectedDestination;
        const { data } = await axiosOther.post("guideservicelist", {
          ServiceName: selectguidename,
          ServiceType: selectservicetype,
          id: "",
          Status: "",
          Destination: destinationsend?.value,
          // HotelCategoryId: "",
        });

        setInitialList(data?.DataList);
        setFilterValue(data?.DataList);
        setTotalPage(data?.TotalPages);

        // setSelectedDestination("")
      } catch (error) {
        console.log("Error fetching destination or hotel list:", error);
      }
    } finally {
      setIsLoading(false);
    }
    //     const filteredData= 
    // ?.value === 'all'?
    //     ? data // show all data
    // : data.filter(item => item.destinationId === selectedDestination.value);
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                {isEditing ? "Update Guide Services" : "Add Guide Services"}
              </h4>
              <button
                className="btn btn-dark btn-custom-size"
                name="SaveButton"
                onClick={() => navigate(-1)}
              >
                <span className="me-1">Back</span>
                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
              </button>
            </div>
            <div className="card-body">
              <div className="form-validation" ref={formRef}>
                <ToastContainer />
                <form
                  className="form-valide"
                  action="#"
                  method="post"
                  onSubmit={handleSubmit}
                >
                  <div className="row">
                    <div className="col-12">
                      <div className="row form-row-gap">
                        <div className="col-md-6 col-lg-3">
                          <label className="" htmlFor="status">
                            Service Type <span className="text-danger">*</span>
                          </label>
                          <select
                            name="ServiceType"
                            id="status"
                            value={formValue?.ServiceType}
                            onChange={handleFormChange}
                            className="form-control form-control-sm"
                          >
                            <option value="Guide">Guide</option>
                            <option value="Porter">Porter</option>
                            <option value="Tour Manager">Tour Manager</option>
                          </select>
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <label className="" htmlFor="status">
                            Destination <span className="text-danger">*</span>
                          </label>
                          <select
                            name="Destination"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.Destination}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            <option value="All">All</option>
                            {destinationList?.map((value, index) => {
                              return (
                                <option value={value.id} key={index + 1}>
                                  {value.Name}
                                </option>
                              );
                            })}
                          </select>
                          {validationErrors?.Destination && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Destination}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label className="" htmlFor="status">
                            Guide Service <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Guide Service"
                            name="Guide_Porter_Service"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.Guide_Porter_Service}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.Guide_Porter_Service && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Guide_Porter_Service}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 col-lg-2">
                          <label className="" htmlFor="status">
                            Status
                          </label>
                          <select
                            name="Status"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.Status}
                            onChange={handleFormChange}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                        </div>
                        <div className="col-md-6 col-lg-1">
                          <label>Default</label>
                          <div className="d-flex gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="Default"
                                value="Yes"
                                id="default_yes"
                                checked={formValue?.Default?.includes("Yes")}
                                onChange={handleFormChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="default_yes"
                              >
                                Yes
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="Default"
                                value="No"
                                id="default_no"
                                checked={formValue?.Default?.includes("No")}
                                onChange={handleFormChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="default_no"
                              >
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-1 d-flex align-items-center m-3">
                          <button
                            type="button"
                            className="btn btn-primary btn-custom-size"
                            onClick={handleSubmit}
                          >
                            {isEditing ? "Update" : "Submit"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-dark btn-custom-size ms-2"
                            onClick={handleReset}
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="card shadow border mt-4">
                  <div className="card-body">
                    <div className="row form-row-gap py-1">
                      <div className="col-md-6 col-lg-1">
                        <label className="" htmlFor="status">
                          Supplier Name <span className="text-danger">*</span>
                        </label>
                        <select
                          name="SupplierId"
                          id="status"
                          className="form-control form-control-sm"
                          value={rateFormValue?.SupplierId}
                          onChange={hanldeRateFormChange}
                        >
                          <option value="">Select</option>
                          {supplierList?.map((item) => {
                            return (
                              <option value={item?.id} key={item?.id}>
                                {item?.Name}
                              </option>
                            );
                          })}
                        </select>
                        {/* {rateValidation?.SupplierId && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {rateValidation?.SupplierId}
                          </div>
                        )} */}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label className="">
                          Rate Valid From <span className="text-danger">*</span>{" "}
                        </label>
                        <DatePicker
                          className="form-control form-control-sm w-100"
                          selected={getFromDate()}
                          name="FromDate"
                          onChange={(e) => handleCalender(e)}
                          dateFormat="dd-MM-yyyy"
                          isClearable todayButton="Today"
                        />
                        {rateValidation?.ValidFrom && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {rateValidation?.ValidFrom}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 col-lg-2">
                        <label className="">
                          Rate Valid To <span className="text-danger">*</span>
                        </label>
                        <DatePicker
                          className="form-control form-control-sm"
                          selected={getNextDate()}
                          name="FromDate"
                          onChange={(e) => handleNextCalender(e)}
                          dateFormat="dd-MM-yyyy"
                          isClearable todayButton="Today"
                        />
                        {rateValidation?.ValidTo && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {rateValidation?.ValidTo}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 col-lg-2">
                        <label>
                          Universal Cost <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="UniversalCost"
                              id="universal_yes"
                              value="Yes"
                              checked={rateFormValue?.UniversalCost?.includes(
                                "Yes"
                              )}
                              onChange={hanldeRateFormChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="universal_yes"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="UniversalCost"
                              id="universal_no"
                              value="No"
                              checked={rateFormValue?.UniversalCost?.includes(
                                "No"
                              )}
                              onChange={hanldeRateFormChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="universal_no"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                      {rateFormValue?.UniversalCost == "No" && (
                        <div className="col-md-6 col-lg-2">
                          <label htmlFor="" className="">
                            SELECT GUIDE/PORTER
                          </label>
                          <select
                            name="GuideId"
                            id=""
                            className="form-control form-control-sm"
                            value={rateFormValue?.GuideId}
                            onChange={hanldeRateFormChange}
                          >
                            <option value="">Select Guide</option>
                            {guideMasterList?.map((item) => {
                              return (
                                <option value={item?.id} key={item?.id}>
                                  {item?.Name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
                      <div className="col-md-6 col-lg-1">
                        <label className="" htmlFor="status">
                          CURRENCY <span className="text-danger">*</span>
                        </label>
                        <select
                          name="Currency"
                          id="status"
                          className="form-control form-control-sm"
                          value={rateFormValue?.Currency}
                          onChange={hanldeRateFormChange}
                        >
                          <option value="">Select</option>
                          {currencyList?.map((item) => {
                            return (
                              <option value={item?.id} key={item?.id}>
                                {item?.CurrencyName}
                              </option>
                            );
                          })}
                        </select>
                        {validationErrors?.Currency && (
                          <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                          >
                            {validationErrors?.Currency}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 col-lg-1">
                        <label htmlFor="">GST SLAB(%)</label>
                        <select
                          select
                          name="GstSlabid"
                          id="status"
                          className="form-control form-control-sm"
                          value={rateFormValue?.GstSlabid}
                          onChange={hanldeRateFormChange}
                        >
                          <option value="">Select</option>
                          {slabList?.DataList?.map((item) => {
                            return (
                              <option value={item?.id} key={item?.id}>
                                {item?.TaxSlabName} ({item?.TaxValue})
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="col-md-6 col-lg-1">
                        <label className="" htmlFor="status">
                          Status
                        </label>
                        <select
                          name="Status"
                          id="status"
                          className="form-control form-control-sm"
                          value={rateFormValue?.Status}
                          onChange={hanldeRateFormChange}
                        >
                          <option value="1">Active</option>
                          <option value="0">InActive</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <table class="table table-bordered itinerary-table mt-3">
                          <thead>
                            <tr>
                              <th colSpan={2}>Particulars</th>
                              <th colSpan={2}>Guide Fee</th>
                              <th colSpan={2}>Language Allowence</th>
                              <th colSpan={2}>Other Cost</th>
                              <th
                                rowSpan={2}
                                className="align-middle text-area-width"
                              >
                                Remarks
                              </th>
                              <th rowSpan={2} className="align-middle">
                                Action
                              </th>
                            </tr>
                            <tr>
                              <th>Start Pax</th>
                              <th>End Pax</th>
                              <th>Full Day</th>
                              <th>Half Day</th>
                              <th>Full Day</th>
                              <th>Half Day</th>
                              <th>Full Day</th>
                              <th>Half Day</th>
                            </tr>
                          </thead>
                          <tbody>
                            {serviceCostForm?.map((service, index) => {
                              return (
                                <tr key={index + 1}>
                                  <td>
                                    <div>
                                      <input
                                        name="StartPax"
                                        type="text"
                                        className="formControl1"
                                        value={serviceCostForm[index]?.StartPax}
                                        onChange={(e) =>
                                          handleServiceCostForm(e, index)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <input
                                        name="EndPax"
                                        type="text"
                                        className="formControl1"
                                        value={serviceCostForm[index]?.EndPax}
                                        onChange={(e) =>
                                          handleServiceCostForm(e, index)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <input
                                        name="GuideFullDayFee"
                                        type="text"
                                        className="formControl1"
                                        value={
                                          serviceCostForm[index]
                                            ?.GuideFullDayFee
                                        }
                                        onChange={(e) =>
                                          handleServiceCostForm(e, index)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                      <input
                                        type="text"
                                        name="GuideHalfDayFee"
                                        className="formControl1 width100px"
                                        value={
                                          serviceCostForm[index]
                                            ?.GuideHalfDayFee
                                        }
                                        onChange={(e) =>
                                          handleServiceCostForm(e, index)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                      <input
                                        type="text"
                                        name="LAFullDayFee"
                                        className="formControl1 width100px"
                                        value={
                                          serviceCostForm[index]?.LAFullDayFee
                                        }
                                        onChange={(e) =>
                                          handleServiceCostForm(e, index)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                      <input
                                        type="text"
                                        name="LAHalfDayFee"
                                        className="formControl1 width100px"
                                        value={
                                          serviceCostForm[index]?.LAHalfDayFee
                                        }
                                        onChange={(e) =>
                                          handleServiceCostForm(e, index)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                      <input
                                        type="text"
                                        name="OthersFullDayFee"
                                        className="formControl1 width100px"
                                        value={
                                          serviceCostForm[index]
                                            ?.OthersFullDayFee
                                        }
                                        onChange={(e) =>
                                          handleServiceCostForm(e, index)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                      <input
                                        type="text"
                                        name="OthersHalfDayFee"
                                        className="formControl1 width100px"
                                        value={
                                          serviceCostForm[index]
                                            ?.OthersHalfDayFee
                                        }
                                        onChange={(e) =>
                                          handleServiceCostForm(e, index)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td className="text-area-width">
                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                      <textarea
                                        name="Remarks"
                                        className="formControl1 w-100"
                                        value={serviceCostForm[index]?.Remarks}
                                        onChange={(e) =>
                                          handleServiceCostForm(e, index)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex w-100 justify-content-center gap-2 ">
                                      <span
                                        onClick={() =>
                                          handleServiceIncrement(index)
                                        }
                                      >
                                        <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                      </span>
                                      <span
                                        onClick={() =>
                                          handleServiceDecrement(index)
                                        }
                                      >
                                        <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <div className=" pb-2">
              <div className="d-flex justify-content-between ">
                <label className="" htmlFor="name">
                  Guide Name
                </label>
              </div>
              <input
                type="text"
                className="form-control form-control-sm "
                id="hotel name"
                value={selectguidename}
                onChange={(e) => setselectguidename(e.target.value)}
                placeholder="Search Hotel"
              />
            </div>
            {/* <div className=" pb-2">
              <div className="d-flex justify-content-between ">
                <label className="" htmlFor="name">
                  Service type
                </label>
              </div>
              <input
                type="text"
                className="form-control form-control-sm "
                id="hotel name"
                value={selectguidename}
                onChange={(e) => setSelectservicetype(e.target.value)}
                placeholder="Search Hotel"
              />
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
          {/* <div className="d-flex align-items-center mb-2 flex-wrap">
            <div className="guest-calendar"></div>
            <div className="newest ms-3">
              <Dropdown>
                <Dropdown.Toggle
                  as="div"
                  className=" btn-select-drop default-select btn i-false"
                >
                  {selectBtn} <i className="fas fa-angle-down ms-2 "></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => setSelectBtn("Oldest")}
                    eventKey="All"
                  >
                    Oldest
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setSelectBtn("Newest")}
                    eventKey="All"
                  >
                    Newest
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div> */}
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
export default GuideService;