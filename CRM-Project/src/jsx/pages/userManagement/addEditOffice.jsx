import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../http/axios_base_url.js";
import { addEditOfficeInitialValue } from "../masters/masters_initial_value.js";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../helper/notify.jsx";
import { MdNavigateNext } from "react-icons/md";
import { MdOutlineSkipNext, MdOutlineSkipPrevious } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import DataTable from "react-data-table-component";
import { table_custom_style } from "../../../css/custom_style.js";
// Validation schema using Yup
const addEditOfficeValidationSchema = Yup.object().shape({
    OfficeName: Yup.string()
        .required("Office Name is required")
        .min(2, "Office Name must be at least 2 characters"),
    Country: Yup.string().required("Country is required"),
    City: Yup.string().required("City is required"),
    State: Yup.string().required("State is required"),
    Address: Yup.string()
        .required("Address is required")
        .min(5, "Address must be at least 5 characters"),
    ContacctPersonName: Yup.string()
        .required("Contact Person Name is required")
        .min(2, "Contact Person Name must be at least 2 characters"),
    Email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    Mobile: Yup.string()
        .required("Mobile number is required")
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
});

const AddEditOffice = () => {
    const [initialList, setInitialList] = useState([]);
    const [formValue, setFormValue] = useState(addEditOfficeInitialValue);
    const [validationErrors, setValidationErrors] = useState({});
    const [filterValue, setFilterValue] = useState([]);
    const [filterInput, setFiterInput] = useState("");
    const [countryList, setCountryList] = useState([]);
    const [DestinationList, setDestinationList] = useState([]);
    const [cityList, setCitylist] = useState([]);
    const [stateList, setStatelist] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPage, setTotalPage] = useState("");
    const [currenctlist, setCurrencylist] = useState([]);
    const [nationalitylist, setNationalitylist] = useState([]);
    const navigate = useNavigate();
    const { state } = useLocation();

    const getListDataToServer = async () => {
        try {
            const { data } = await axiosOther.post("listCompanyOfc", {
                Page: currentPage,
                PerPage: rowsPerPage,
            });
            setTotalPage(data?.TotalPages);
            setInitialList(data?.DataList);
            setFilterValue(data?.DataList);
            setFormValue(data?.DataList);
        } catch (error) {
            console.log("city-error", error);
        }

        try {
            const Data = await axiosOther.post("nationalitylist", {
                Search: "",
                Status: 1,
            });
            setNationalitylist(Data.data.DataList);
        } catch (err) {
            console.log(err);
        }
        try {
            const Data = await axiosOther.post("currencymasterlist");
            setCurrencylist(Data.data.DataList);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getListDataToServer();
    }, [rowsPerPage, currentPage, addEditOfficeInitialValue]);

    const getDataToServer = async () => {
        try {
            const response = await axiosOther.post("destinationlist", {
                Search: "",
                Status: 1,
            });
            setDestinationList(response.data.DataList);
        } catch (error) {
            console.error("Error fetching destinations:", error);
        }
        try {
            const countryResponse = await axiosOther.post("countrylist", {
                Search: "",
                Status: 1,
            });
            const countryListData = countryResponse.data.DataList;
            setCountryList(countryListData);

            // Set default country to India
            const india = countryListData.find(country => country.Name === "India");
            if (india && !state) {
                setFormValue(prev => ({
                    ...prev,
                    Country: india.id
                }));
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        getDataToServer();
    }, []);
    useEffect(() => {
        if (!formValue?.Country && countryList?.length > 0) {
            const india = countryList.find(item => item?.Name?.toLowerCase() === "india");
            if (india) {
                setFormValue(prev => ({
                    ...prev,
                    Country: india.id
                }));
            }
        }
    }, [countryList]);


    useEffect(() => {
        const dependentStateAndCity = async () => {
            try {
                const { data } = await axiosOther.post("citybycountry", {
                    CountryId: formValue?.Country,
                });
                setCitylist(data.DataList);
            } catch (err) {
                console.log(err);
            }
            try {
                const { data } = await axiosOther.post("citystatebyid", {
                    CityId: formValue?.City || state?.City,
                });
                setStatelist([{ id: data.StateId, Name: data.StateName }]);
            } catch (err) {
                console.log("Error fetching state list:", err);
            }
        };
        dependentStateAndCity();
    }, [formValue?.Country, formValue?.City]);

    useEffect(() => {
        if (state && Object.keys(state).length > 0) {
            setFormValue((prev) => ({
                ...prev,
                id: state.id || "",
                Name: state.Name || "Head Office",
                Pan: state.Pan || "",
                PinCode: state.PinCode || "",
                Address: state.Address || "",
                Fk_partnerid: state.Fk_partnerid || "",
                Gstn: state.Gstn || "",
                Country: state.Country || "",
                City: state.City || "",
                PlaceOfDeliveryInvoice: state.PlaceOfDeliveryInvoice || "",
                PrimaryAddress: state.PrimaryAddress || "",
                State: state.State || "",
                Type: state.Type || "",
                AddedBy: "0",
                UpdatedBy: "1",
            }));
        }
    }, [state]);

    useEffect(() => {
        if (stateList?.length > 0) {
            setFormValue((prev) => ({ ...prev, State: stateList[0]?.id }));
        }
    }, [stateList]);
    useEffect(() => {
        const nationalityId = formValue?.Nationality;

        // Check if required lists are loaded
        if (!nationalitylist.length || !currenctlist.length || nationalityId === undefined) return;

        const nationalityName = nationalitylist.find(
            (item) => item?.id == nationalityId
        );
        const INRID = currenctlist.find((item) => item?.CurrencyName === "INR");
        const USDID = currenctlist.find((item) => item?.CurrencyName === "USD");

        if (nationalityName?.Name === "Indian") {
            setFormValue((prev) => ({
                ...prev,
                Currency: INRID?.id || "",
            }));
        } else {
            setFormValue((prev) => ({
                ...prev,
                Currency: USDID?.id || prev.Currency,
            }));
        }
    }, [formValue?.Nationality, nationalitylist, currenctlist]);

    useEffect(() => {
        if (!formValue?.Nationality && nationalitylist.length) {
            const indian = nationalitylist.find((n) => n?.Name === "Indian");
            if (indian) {
                setFormValue((prev) => ({
                    ...prev,
                    Nationality: indian.id,
                }));
            }
        }
    }, [nationalitylist]);
    console.log(formValue, "formvalue");


    useEffect(() => {
        const filteredList = initialList?.filter(
            (data) =>
                data?.ContacctPersonName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
                data?.OfficeName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
                data?.StateName?.toLowerCase()?.includes(filterInput?.toLowerCase())
        );
        setFilterValue(filteredList);
    }, [filterInput]);

    const table_columns = [
        {
            name: "Id.",
            selector: (row) => row?.id,
            cell: (row) => <span>{row?.id}</span>,
            sortable: true,
            width: "5rem",
        },
        {
            name: "Company Id",
            selector: (row) => row?.CompanyId,
            cell: (row) => <span>{row?.CompanyId}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            name: "Office Name",
            selector: (row) => <span>{row?.OfficeName}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            name: "Contact Person Name",
            selector: (row) => <span>{row?.ContacctPersonName}</span>,
            sortable: true,
            width: "14rem",
        },
        {
            name: "Address",
            selector: (row) => <span>{row?.Address}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            name: "City",
            selector: (row) => <span>{row?.CityName}</span>,
            sortable: true,
            width: "6rem",
        },
        {
            name: "State",
            selector: (row) => <span>{row?.StateName}</span>,
            sortable: true,
        },
        {
            name: "Country",
            selector: (row) => <span>{row?.CountryName}</span>,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => <span>{row?.Email}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            name: "Phone",
            selector: (row) => <span>{row?.Phone}</span>,
            sortable: true,
        },
        {
            name: "Mobile",
            selector: (row) => <span>{row?.Mobile}</span>,
            sortable: true,
        },
        {
            name: "Gst.No",
            selector: (row) => <span>{row?.GstNo}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            name: "Currency",
            selector: (row) => <span>{row?.CurrencyName}</span>,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => (
                <span
                    className={`badge text-center mx-auto ${row.Status === 1 ? "badge-success light badge" : "badge-danger light badge"
                        }`}
                >
                    {row.Status === 1 ? "Active" : "Inactive"}
                </span>
            ),
            sortable: true,
        },
        {
            name: "Action",
            selector: (row) => {
                return (
                    <div className="d-flex align-items-center gap-1 sweetalert">
                        <i
                            role="button"
                            tabIndex={0}
                            aria-label="Edit"
                            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
                            onClick={() => handleEdit(row)}
                        ></i>
                        <div className="sweetalert mt-5"></div>
                        <i
                            role="button"
                            tabIndex={0}
                            aria-label="Delete"
                            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
                            onClick={() => handleDelete(row?.id)}
                        ></i>
                    </div>
                );
            },
        },
    ];

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormValue((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear validation error for the field being changed
        setValidationErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addEditOfficeValidationSchema.validate(formValue, {
                abortEarly: false,
            });
            setValidationErrors({});

            const { data } = await axiosOther.post("craeteupdatecompanyOfc", {
                ...formValue,
                CompanyId: state?.data?.ID,
            });
            if (data?.Status == 1) {
                setFormValue(addEditOfficeInitialValue);
                getListDataToServer();
                notifySuccess(data?.message || data?.Message);
            } else {
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

            if (error.response?.data?.Errors) {
                const data = Object.entries(error.response?.data?.Errors);
                notifyError(data[0][1]);
            }
        }
    };

    const handleEdit = (value) => {
        setFormValue({
            id: value?.id,
            CompanyId: value?.CompanyId,
            OfficeName: value?.OfficeName,
            Country: value?.Country,
            State: value?.State,
            City: value?.City,
            Address: value?.Address,
            ContacctPersonName: value?.ContacctPersonName,
            Email: value?.Email,
            CountryCode: value?.CountryCode,
            Phone: value?.Phone,
            Mobile: value?.Mobile,
            GstNo: value?.GstNo,
            Currency: value?.Currency,
            Status: value?.Status == "Active" ? 1 : 0,
            AddedBy: value?.AddedBy,
            UpdatedBy: value?.UpdatedBy,
        });
        setIsEditing(true);
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
                const { data } = await axiosOther.post("deletecompanyOfc", {
                    id: id,
                });
                if (data?.Status == 1 || data?.status == 1 || data?.result) {
                    notifySuccess(data?.Message || data?.message || data?.result);
                    getListDataToServer();
                }
            } catch (err) {
                if (err) {
                    notifyError(err?.message || err?.Message);
                }
            }
        }
    };

    const handleReset = () => {
        setFormValue(addEditOfficeInitialValue);
        setValidationErrors({});
        setIsEditing(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
    };

    const CustomPagination = () => {
        return (
            <div className="custom-pagination d-flex gap-3 py-2 justify-content-end align-items-center mb-5 shadow border-bottom">
                <div className="d-flex gap-3 align-items-center">
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
        <>
            <div className="row form-row-gap">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header py-3">
                            <h4 className="card-title d-flex align-items-center gap-2">
                                Add Office: <strong style={{ fontSize: "1.2em" }}>{state?.data?.COMPANYNAME}</strong>
                            </h4>
                            <div className="d-flex gap-3">
                                <button
                                    className="btn btn-dark btn-custom-size"
                                    onClick={() => navigate(-1)}
                                >
                                    <span className="me-1">Back</span>
                                    <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="btn btn-primary btn-custom-size"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card cardPaddingZero">
                                    <div className="card-body mt-1">
                                        <div className="form-validation">
                                            <form
                                                className="form-valide"
                                                action="#"
                                                method="post"
                                                onSubmit={(e) => e.preventDefault()}
                                            >
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row form-row-gap">
                                                            <div className="col-md-6 col-lg-2">
                                                                <div className="">
                                                                    <label className="" htmlFor="OfficeName">
                                                                        Office Name
                                                                        <span className="text-danger">*</span>
                                                                    </label>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    id="OfficeName"
                                                                    name="OfficeName"
                                                                    value={formValue?.OfficeName}
                                                                    onChange={handleFormChange}
                                                                    placeholder="Office Name"
                                                                />
                                                                {validationErrors?.OfficeName && (
                                                                    <div
                                                                        className="invalid-feedback animated fadeInUp"
                                                                        style={{ display: "block" }}
                                                                    >
                                                                        {validationErrors?.OfficeName}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-md-6 col-lg-2">
                                                                <label className="" htmlFor="Country">
                                                                    Country
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                                <select
                                                                    name="Country"
                                                                    id="Country"
                                                                    className="form-control form-control-sm"
                                                                    value={formValue?.Country}
                                                                    onChange={handleFormChange}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {countryList &&
                                                                        countryList?.length > 0 &&
                                                                        countryList.map((data, index) => (
                                                                            <option value={data?.id} key={index}>
                                                                                {data?.Name}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                                {validationErrors?.Country && (
                                                                    <div
                                                                        className="invalid-feedback animated fadeInUp"
                                                                        style={{ display: "block" }}
                                                                    >
                                                                        {validationErrors?.Country}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-md-6 col-lg-2">
                                                                <label className="" htmlFor="City">
                                                                    City
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                                <select
                                                                    name="City"
                                                                    id="City"
                                                                    className="form-control form-control-sm"
                                                                    value={formValue?.City}
                                                                    onChange={handleFormChange}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {cityList &&
                                                                        cityList?.length > 0 &&
                                                                        cityList.map((data, index) => (
                                                                            <option value={data?.id} key={index}>
                                                                                {data?.Name}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                                {validationErrors?.City && (
                                                                    <div
                                                                        className="invalid-feedback animated fadeInUp"
                                                                        style={{ display: "block" }}
                                                                    >
                                                                        {validationErrors?.City}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-md-6 col-lg-2">
                                                                <label htmlFor="State">State<span className="text-danger">*</span></label>
                                                                <select
                                                                    name="State"
                                                                    id="State"
                                                                    className="form-control form-control-sm"
                                                                    value={
                                                                        formValue?.State ||
                                                                        (stateList?.length > 0 ? stateList[0]?.id : "")
                                                                    }
                                                                    onChange={handleFormChange}
                                                                >
                                                                    {stateList?.length > 0 ? (
                                                                        stateList.map(({ id, Name }) => (
                                                                            <option key={id} value={id}>
                                                                                {Name}
                                                                            </option>
                                                                        ))
                                                                    ) : (
                                                                        <option value="">Select</option>
                                                                    )}
                                                                </select>
                                                                {validationErrors?.State && (
                                                                    <div
                                                                        className="invalid-feedback animated fadeInUp"
                                                                        style={{ display: "block" }}
                                                                    >
                                                                        {validationErrors?.State}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-md-6 col-lg-4">
                                                                <div className="">
                                                                    <label className="" htmlFor="Address">
                                                                        Address
                                                                        <span className="text-danger">*</span>
                                                                    </label>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    id="Address"
                                                                    className="form-control form-control-sm"
                                                                    name="Address"
                                                                    value={formValue?.Address}
                                                                    onChange={handleFormChange}
                                                                    placeholder="Address"
                                                                    style={{ maxHeight: "30px" }}
                                                                />
                                                                {validationErrors?.Address && (
                                                                    <div
                                                                        className="invalid-feedback animated fadeInUp"
                                                                        style={{ display: "block" }}
                                                                    >
                                                                        {validationErrors?.Address}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-md-6 col-lg-2">
                                                                <div className="">
                                                                    <label className="" htmlFor="ContacctPersonName">
                                                                        Contact Person Name
                                                                        <span className="text-danger">*</span>
                                                                    </label>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    id="ContacctPersonName"
                                                                    name="ContacctPersonName"
                                                                    value={formValue?.ContacctPersonName}
                                                                    onChange={handleFormChange}
                                                                    placeholder="Contact Person Name"
                                                                />
                                                                {validationErrors?.ContacctPersonName && (
                                                                    <div
                                                                        className="invalid-feedback animated fadeInUp"
                                                                        style={{ display: "block" }}
                                                                    >
                                                                        {validationErrors?.ContacctPersonName}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-md-6 col-lg-2">
                                                                <div className="">
                                                                    <label className="" htmlFor="Email">
                                                                        Email
                                                                        <span className="text-danger">*</span>
                                                                    </label>
                                                                </div>
                                                                <input
                                                                    type="email"
                                                                    className="form-control form-control-sm"
                                                                    id="Email"
                                                                    name="Email"
                                                                    value={formValue?.Email}
                                                                    onChange={handleFormChange}
                                                                    placeholder="Email"
                                                                />
                                                                {validationErrors?.Email && (
                                                                    <div
                                                                        className="invalid-feedback animated fadeInUp"
                                                                        style={{ display: "block" }}
                                                                    >
                                                                        {validationErrors?.Email}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-md-6 col-lg-2">
                                                                <label className="">Phone</label>
                                                                <div className="input-group">
                                                                    <input
                                                                        type="number"
                                                                        className="form-control form-control-sm"
                                                                        id="Phone"
                                                                        name="Phone"
                                                                        value={formValue?.Phone}
                                                                        onChange={handleFormChange}
                                                                        placeholder="Phone"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 col-lg-2">
                                                                <label className="m-0 pb-1 p-0">Mobile
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                                <div className="input-group">
                                                                    <input
                                                                        type="number"
                                                                        className="form-control form-control-sm"
                                                                        id="Mobile"
                                                                        name="Mobile"
                                                                        value={formValue?.Mobile}
                                                                        onChange={handleFormChange}
                                                                        placeholder="Mobile"
                                                                    />
                                                                </div>
                                                                {validationErrors?.Mobile && (
                                                                    <div
                                                                        className="invalid-feedback animated fadeInUp"
                                                                        style={{ display: "block" }}
                                                                    >
                                                                        {validationErrors?.Mobile}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-md-6 col-lg-4">
                                                                <div className="">
                                                                    <label className="" htmlFor="GstNo">
                                                                        GSTIN Number
                                                                    </label>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    id="GstNo"
                                                                    name="GstNo"
                                                                    value={formValue?.GstNo}
                                                                    onChange={handleFormChange}
                                                                    placeholder="GSTIN Number"
                                                                />
                                                            </div>
                                                            <div className="col-md-6 col-lg-2">
                                                                <label className="" htmlFor="Currency">
                                                                    Currency
                                                                </label>
                                                                <select
                                                                    name="Currency"
                                                                    id="Currency"
                                                                    className="form-control form-control-sm"
                                                                    value={formValue?.Currency}
                                                                    onChange={handleFormChange}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {currenctlist?.length > 0 &&
                                                                        currenctlist.map((value, index) => (
                                                                            <option value={value.id} key={index + 1}>
                                                                                {value.CurrencyName}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            </div>
                                                            <div className="col-md-6 col-lg-2">
                                                                <label className="" htmlFor="Status">
                                                                    Status
                                                                </label>
                                                                <select
                                                                    name="Status"
                                                                    id="Status"
                                                                    className="form-control form-control-sm"
                                                                    value={formValue?.Status}
                                                                    onChange={handleFormChange}
                                                                >
                                                                    <option value="1">Active</option>
                                                                    <option value="0">Inactive</option>
                                                                </select>
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
                    <div className="d-flex align-items-center mb-2 flex-wrap"></div>
                </div>
                <div className="table-responsive">
                    <div id="example2_wrapper" className="dataTables_wrapper no-footer">
                        <DataTable
                            columns={table_columns}
                            data={filterValue}
                            sortIcon={<i className="fa-solid fa-sort fs-4"></i>}
                            striped
                            paginationServer
                            highlightOnHover
                            customStyles={table_custom_style}
                            defaultSortFieldId={1}
                            paginationTotalRows={4}
                            defaultSortAsc={false}
                            className="custom-scrollbar"
                        />
                        <CustomPagination />
                    </div>
                </div>
            </Tab.Container>
        </>
    );
};
export default AddEditOffice;
