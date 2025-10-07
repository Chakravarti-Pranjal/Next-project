import React, { useState, useEffect } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { hotelChainValidationSchema } from "../master_validation.js";
import { hotelChainInitialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { wrap } from "framer-motion";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import useMultipleSelect from "../../../../hooks/custom_hooks/useMultipleSelect";
import { scrollToTop } from "../../../../helper/scrollToTop.js";

const HotelType = () => {
  const [selectBtn, setSelectBtn] = useState("Newest");
  const [initialList, setInitialList] = useState([]);
  const [formValue, setFormValue] = useState(hotelChainInitialValue);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterValue, setFilterValue] = useState([]);
  const [filterInput, setFiterInput] = useState("");
  const [destinationList, setDestinationList] = useState([]);
  const [phoneValue, setPhoneValue] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const handlePageChange = (page) => setCurrentPage(page - 1);
  const handleRowsPerPageChange = (newRowsPerPage) =>
    setRowsPerPage(newRowsPerPage);

  const postDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("destinationlist", {
        CountryId: "",
        StateId: "",
        Name: "",
        Default: "",
        Status: "",
      });
      setDestinationList(data?.DataList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    postDataToServer();
  }, []);

  // multi select option value
  const destinationOption = destinationList?.map((item) => {
    return {
      value: item?.id,
      label: item?.Name,
    };
  });

  // multi select input
  const {
    SelectInput: DestinatinoInput,
    selectedData: destinationData,
    setSelectedData: setDestinationData,
  } = useMultipleSelect(destinationOption);

  const getListDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("hotelchainlist");
      setInitialList(data?.DataList);
      setFilterValue(data?.DataList);
    } catch (error) {
      console.log("country-error", error);
    }
  };
  useEffect(() => {
    getListDataToServer();
  }, []);

  // table data filtering -- with useeffect
  useEffect(() => {
    const filteredList = initialList?.filter(
      (data) =>
        data?.Name?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
        // data?.UploadKeyword?.toLowerCase()?.includes(
        //   filterInput?.toLowerCase()
        // ) ||
        data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
    );
    setFilterValue(filteredList);
  }, [filterInput]);
  const handlePhoneChange = (phone) => {
    // console.log("phone-value", phone);
    setPhoneValue(phone);
  };

  const table_columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => (
        <span className="font-size-11">
          {currentPage * rowsPerPage + index + 1}
        </span>
      ),
      sortable: false,
      wrap: true,
      width: "5rem",
    },
    {
      name: "Hotel Chain Name",
      selector: (row) => row?.Name,
      cell: (row) => <span>{row?.Name} </span>,
      sortable: true,
      wrap: true,
      width: "10rem",
    },
    {
      name: "Destination",
      selector: (row) =>
        row?.Destination?.map((data) => data?.DestinationName).join(", ") || "",
      cell: (row) => {

        return (
          <span>
            {row?.Destination?.map((data) => data?.DestinationName) // Extract DestinationName
              .join(", ")}{" "}
            {/* Join with a comma and space */}
          </span>
        )
      },
      sortable: true,
      width: "10rem",
      wrap: true,
    },
    {
      name: "Hotel Website",
      selector: (row) => row?.HotelWebsite,
      cell: (row) => <span>{row?.HotelWebsite}</span>,
      sortable: true,
      width: "15rem",
    },
    {
      name: "Contact",
      selector: (row) =>
        `${row?.ContactName} (${row?.ContactDesignation}), ${row?.ContactMobile}, ${row?.ContactEmail}`,
      cell: (row) => (
        <span>
          {row?.ContactName} ({row?.ContactDesignation}),
          <a href={`tel:${row?.ContactMobile}`} style={{ color: "blue" }}>
            {" "}
            {row?.ContactMobile},
          </a>
          <a href={`mailto:${row?.ContactEmail}`} className="text-primary">
            {row?.ContactEmail}
          </a>
        </span>
      ),
      sortable: true,
      wrap: true,
      minWidth: "20rem",
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
            {row.Status == "Active" ? "Active" : "Inactive"}
          </span>
        );
      },
      sortable: true,
      // width: "7rem",
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <div className="d-flex gap-1 sweetalert align-items-center">
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
    },
  ];
  const handleReset = () => {
    setFormValue(hotelChainInitialValue);
    setValidationErrors({});
    setIsEditing(false);
  };
  // handlign form changes
  const handleFormChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type == "file") {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const base64String = base64.split(",")[1];
        setFormValue({
          ...formValue,
          ImageData: base64String,
          ImageName: file.name,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFormValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await hotelChainValidationSchema.validate(formValue, {
        abortEarly: false,
      });
      setValidationErrors({});
      //  console.log(formValue);
      const { data } = await axiosOther.post("addupdatehotelchain", {
        ...formValue,
        Destination: destinationData,
        ContactMobile: phoneValue,
      });
      if (data?.Status == 1) {
        getListDataToServer();
        setFormValue(hotelChainInitialValue);
        notifySuccess(data?.message || data?.Message);
        //   alert(data?.Message || data?.message);
      }

      if (data?.Status != 1) {
        notifyError(data?.message || data?.Message);
      }
    } catch (error) {
      if (error.inner) {
        const validationErrorss = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setValidationErrors(validationErrorss);
      }

      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
      }
    }
  };

  const handleEdit = (value) => {
    console.log("Value", value);
    // console.log(
    //   "cc",
    //   value?.Destination?.map((Data) => Data?.DestinationId)
    // );
    setFormValue({
      id: value?.Id,
      Name: value?.Name,
      // Destination: value?.Destination,
      HotelWebsite: value?.HotelWebsite,
      ContactType: value?.ContactType,
      ContactName: value?.ContactName,
      ContactDesignation: value?.ContactDesignation,
      ContactCountryCode: "+91",
      Destination: value?.Destination?.map((Data) => Data?.DestinationId),
      ContactMobile: value?.ContactMobile,
      ContactEmail: value?.ContactEmail,
      Status:
        value?.Status == null || value?.Status == "" ? "Active" : value?.Status,
      AddedBy: value?.AddedBy,
      UpdatedBy: value?.UpdatedBy,
    });
    // console.log(formValue, "form")
    setDestinationData(
      value?.Destination?.map((Data) => Data?.DestinationId) || []
    );
    // setPhoneValue("8809936726" || "");
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
        const { data } = await axiosOther.post("deletehotelchain", {
          id: id,
        });
        if (data?.Status == 1 || data?.status == 1 || data?.result) {
          notifySuccess(data?.Message || data?.message || data?.result);
          getListDataToServer();
        }
      } catch (err) {
        if (err) {
          notifyError(err?.message || err?.Message || err?.result);
          //   alert(err?.message || err?.Message);
        }
      }
    }
  };
  // handlign form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Add Hotel Chain</h4>
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
              <div className="form-validation">
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
                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Hotel Chain Name
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="Name"
                            placeholder="Hotel Chain Name"
                            value={formValue?.Name}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.Name && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.Name}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="name">
                              Hotel Website
                              {/* <span className="text-danger">*</span> */}
                            </label>
                          </div>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="HotelWebsite"
                            placeholder="Enter Hotel Website"
                            value={formValue?.HotelWebsite}
                            onChange={handleFormChange}
                          />
                          {validationErrors?.HotelWebsite && (
                            <div
                              id="val-username1-error"
                              className="invalid-feedback animated fadeInUp"
                              style={{ display: "block" }}
                            >
                              {validationErrors?.HotelWebsite}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 col-lg-4">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="status">
                              Destination
                              {/* <span className="text-danger">*</span> */}
                            </label>
                          </div>

                          <DestinatinoInput />
                        </div>

                        <div className="col-md-6 col-lg-2">
                          <div className="d-flex justify-content-between">
                            <label className="" htmlFor="status">
                              Status
                            </label>
                          </div>
                          <select
                            name="Status"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.Status}
                            onChange={handleFormChange}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>

                        <div className="row mt-4 form-row-gap">
                          <div className="col-12">
                            <div className="custom-bottom-border">
                              <span>Contact Information</span>
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-2">
                            <div className="d-flex justify-content-between">
                              <label className="" htmlFor="status">
                                Contact Person
                              </label>
                            </div>
                            <select
                              name="ContactType"
                              id=""
                              className="form-control form-control-sm"
                              value={formValue?.ContactType}
                              onChange={handleInputChange}
                            >
                              <option value="">Select</option>
                              <option value="1">Account</option>
                              <option value="2">Operation</option>
                              <option value="3">Sales</option>
                            </select>
                          </div>
                          <div className="col-md-6 col-lg-2">
                            <div className="d-flex justify-content-between">
                              <label className="" htmlFor="status">
                                Name
                              </label>
                            </div>
                            <input
                              type="text"
                              placeholder="Name"
                              className="form-control form-control-sm"
                              name="ContactName"
                              value={formValue?.ContactName}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-md-6 col-lg-2">
                            <div className="d-flex justify-content-between">
                              <label className="" htmlFor="status">
                                Designation
                              </label>
                            </div>
                            <input
                              type="text"
                              placeholder="Designation"
                              className="form-control form-control-sm"
                              name="ContactDesignation"
                              value={formValue?.ContactDesignation}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-md-6 col-lg-2">
                            <div className="d-flex justify-content-between">
                              <label className="" htmlFor="status">
                                Phone
                              </label>
                            </div>
                            <PhoneInput
                              defaultCountry="in"
                              value={phoneValue}
                              onChange={handlePhoneChange}
                            />
                          </div>
                          <div className="col-md-6 col-lg-2">
                            <div className="d-flex justify-content-between">
                              <label className="" htmlFor="status">
                                Email <span className="text-danger">*</span>
                              </label>
                            </div>

                            <input
                              type="text"
                              placeholder="Email"
                              className="form-control form-control-sm"
                              name="ContactEmail"
                              value={formValue?.ContactEmail}
                              onChange={handleInputChange}
                            />

                            {validationErrors?.ContactEmail && (
                              <div
                                id="val-username1-error"
                                className="invalid-feedback animated fadeInUp"
                                style={{ display: "block" }}
                              >
                                {validationErrors?.ContactEmail}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-12 text-end">
                          <button
                            type="submit"
                            className="btn btn-primary btn-custom-size  "
                          >
                            Submit
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
          <div className="col-md-8">
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
          {/* <div className="d-flex align-items-center mb-2 flex-wrap">
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
export default HotelType;
