import React,{ useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown,Tab,Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url.js";
import { cruisecompanymasterValidationSchema } from "../master_validation.js";
import { cruisecompanymasterInitialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess,notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import useMultipleSelect from "../../../../hooks/custom_hooks/useMultipleSelect.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import { select_customStyles } from "../../../../css/custom_style.js";
import Select from "react-select";
const CruiseCompany = () => {
    const [selectBtn,setSelectBtn] = useState("Newest");
    const [initialList,setInitialList] = useState([]);
    const [formValue,setFormValue] = useState(cruisecompanymasterInitialValue);
    const [validationErrors,setValidationErrors] = useState({});
    const [Destinationlist,setDestinationlist] = useState([]);
    const [filterValue,setFilterValue] = useState([]);
    const [countryList,setCountryList] = useState([]);
    const [stateList,setStateList] = useState([]);
    const [cityList,setCityList] = useState([]);
    const [city,setCity] = useState("");
    const [filterInput,setFiterInput] = useState("");
    const [isEditing,setIsEditing] = useState(false);
    const formRef = useRef(null);
    const [currentPage,setCurrentPage] = useState(0);
    const [rowsPerPage,setRowsPerPage] = useState(10);
    const navigate = useNavigate();

    const [destinationList,setDestinationList] = useState([]);
    const destinationOption = destinationList?.map((dest) => {
        return {
            value: dest?.id,
            label: dest?.Name,
        };
    });
    const cityOptions = cityList.map(item => ({
        value: item.id,
        label: item.Name
    }));

    const handlePageChange = (page) => setCurrentPage(page - 1);
    const handleRowsPerPageChange = (newRowsPerPage) =>
        setRowsPerPage(newRowsPerPage);

    const getListDataToServer = async () => {
        try {
            const { data } = await axiosOther.post("cruisecompanymasterlist");
            setInitialList(data?.DataList);
            setFilterValue(data?.DataList);
        } catch (error) {
            console.log("cruisecompany-error",error);
        }
    };

    useEffect(() => {
        getListDataToServer();
    },[]);


    useEffect(() => {
        const filteredList = initialList?.filter(
            (data) =>
                data?.CruiseCompanyName?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
                data?.Destination?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
                data?.Country?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
                data?.State?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
                data?.City?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
                data?.PinCode?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
                data?.Address?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
                data?.Status?.toLowerCase()?.includes(filterInput?.toLowerCase())
        );
        setFilterValue(filteredList);
    },[filterInput]);

    // const countryLabel = countryList?.map((country) => ({ value: country?.id,label: country?.Name }));
    // const stateLabel = stateList?.map((state) => ({ value: state?.id,label: state?.Name }));
    // const cityLabel = cityList?.map((city) => ({ value: city?.id,label: city?.Name }));

    // const {
    //     SelectInput: DestinationInput,
    //     selectedData: destinationSelected,
    //     setSelectedData: setDestinationSelected,
    // } = useMultipleSelect(destinationOption);

    // const {
    //     SelectInput: CountryInput,
    //     selectedData: countrySelected,
    //     setSelectedData: setCountrySelected,
    // } = useMultipleSelect(countryLabel);
    // const {
    //     SelectInput: StateInput,
    //     selectedData: stateSelected,
    //     setSelectedData: setStateSelected,
    // } = useMultipleSelect(stateLabel);
    // const {
    //     SelectInput: CityInput,
    //     selectedData: citySelected,
    //     setSelectedData: setcitySelected,
    // } = useMultipleSelect(cityLabel);


    const getStateDataToServer = async () => {
        try {
            const stateData = await axiosOther.post("listStateByCountry",{
                Search: "",
                Status: 1,
                countryid: formValue?.CountryId,
            });
            setStateList(stateData.data.DataList);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getStateDataToServer();
    },[formValue?.CountryId]);
    const getDataToServer = async () => {
        try {
            const countryData = await axiosOther.post("countrylist",{
                Search: "",
                Status: 1,
            });
            setCountryList(countryData.data.DataList);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getDataToServer();
    },[]);
    const handleSelectChange = (selectedOption,name) => {

        switch (name) {
            case "country":
                setCountry(selectedOption.value)

                break;
            case "stateCity":
                setStateCity(selectedOption.value)

                break;
            case "city":
                setCity(selectedOption.value)

                break;
            case "currency":
                setFormValue({
                    ...formValue,
                    OthersInfo: {
                        ...formValue.OthersInfo,
                        CurrencyId: selectedOption.value,
                        CurrencyName: selectedOption.label
                    }
                })
                break;
            default:
                console.log("nothing")

        }
    };

    const table_columns = [
        {
            name: "Sr. No.",
            selector: (row,index) => (
                <span className="font-size-11">
                    {currentPage * rowsPerPage + index + 1}
                </span>
            ),
            width: "5rem",
            style: {
                display: "flex",
                justifyContent: "center",
            },
        },
        {
            name: "CruiseCompanyName",
            selector: (row) => row?.CruiseCompanyName,
            cell: (row) => <span>{row?.CruiseCompanyName}</span>,
            width: "11rem",
            sortable: true,
        },
        {
            name: "Destination",
            selector: (row) => row?.Destination,
            cell: (row) => <span>{row?.Destination}</span>,
            sortable: true,
        },
        {
            name: "Country",
            selector: (row) => row?.Country,
            cell: (row) => <span>{row?.Country}</span>,
            sortable: true,
        },
        {
            name: "State",
            selector: (row) => row?.State,
            cell: (row) => <span>{row?.State}</span>,
            sortable: true,
        },
        {
            name: "City",
            selector: (row) => row?.City,
            cell: (row) => <span>{row?.City}</span>,
            sortable: true,
        },
        {
            name: "PinCode",
            selector: (row) => row?.PinCode,
            cell: (row) => <span>{row?.PinCode}</span>,
            sortable: true,
        },
        {
            name: "Address",
            selector: (row) => row?.Address,
            cell: (row) => <span>{row?.Address}</span>,
            sortable: true,
        },
        {
            name: "Website",
            selector: (row) => row?.Website,
            cell: (row) => <span>{row?.Website}</span>,
            sortable: true,
        },
        {
            name: "GST",
            selector: (row) => row?.GST,
            cell: (row) => <span>{row?.GST}</span>,
            sortable: true,
        },
        {
            name: "SelfSupplier",
            selector: (row) => row?.SelfSupplier,
            cell: (row) => <span>{row?.SelfSupplier}</span>,
            sortable: true,
        },
        {
            name: "Type",
            selector: (row) => row?.Type,
            cell: (row) => <span>{row?.Type}</span>,
            sortable: true,
        },
        {
            name: "Phone",
            selector: (row) => row?.Phone,
            cell: (row) => <span>{row?.Phone}</span>,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row?.Email,
            cell: (row) => <span>{row?.Email}</span>,
            sortable: true,
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
        const { name,value } = e.target;
        setFormValue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    // handlign form changes
    const handleInputChange = (e) => {
        const { name,value } = e.target;
        setFormValue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await cruisecompanymasterValidationSchema.validate(formValue,{
                abortEarly: false,
            });
            setValidationErrors({});
            const { data } = await axiosOther.post("addupdatecruisecompanymaster",formValue);
            if (data?.Status === 1) {
                getListDataToServer();
                setIsEditing(false);
                setFormValue(cruisecompanymasterInitialValue);
                notifySuccess(data?.message || data?.Message);
            } else {
                notifyError(data?.message || data?.Message);
            }
        } catch (error) {
            console.log('err-check',error);
            if (error.inner) {
                const validationErrorss = error.inner.reduce((acc,curr) => {
                    acc[curr.path] = curr.message;
                    return acc;
                },{});
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
        setFormValue({
            id: value?.id,
            CruiseCompanyName: value?.CruiseCompanyName,
            Destination: value?.Destination,
            Country: value?.Country,
            State: value?.State,
            City: value?.City,
            PinCode: value?.PinCode,
            Address: value?.Address,
            Type: value?.Type,
            Website: value?.Website,
            GST: value?.GST,
            SelfSupplier: value?.SelfSupplier,
            Phone: value?.Phone,
            Email: value?.Email,
            Status: value?.Status === "Active" ? 1 : 0,
            AddedBy: value?.AddedBy,
            UpdatedBy: value?.UpdatedBy,
        });
        setIsEditing(true);
        formRef.current.scrollIntoView({ behavior: "smooth" });
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
                const { data } = await axiosOther.post("deletecruisecompany",{ id });
                if (data?.Status == 1 || data?.status == 1 || data?.result) {
                    notifySuccess(data?.Message || data?.message || data?.result);
                    getListDataToServer();
                }
            } catch (err) {
                notifyError(err?.message || err?.Message);
            }
        }
    };

    const handleReset = () => {
        setFormValue(cruisecompanymasterInitialValue);
        setValidationErrors({});
        setIsEditing(false);
    };
    const getDropdownDataToServer = async () => {
        try {
            const { data } = await axiosOther.post("destinationlist",{
                Search: "",
                Status: 1,
            });
            setDestinationlist(data.DataList);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getDropdownDataToServer();
    },[]);
    useEffect(() => {
        const dependentStateAndCity = async () => {
            try {
                const { data } = await axiosOther.post("statelist",{
                    countryid: formValue?.HotelCountry,
                });
                setStateList(data.DataList);
            } catch (err) {
                console.log(err);
            }
            try {
                const { data } = await axiosOther.post(
                    "citylist",
                    {
                        countryid: formValue?.Country,
                        stateid: formValue?.State,
                    }
                );
                setCityList(data.DataList);
            } catch (err) {
                console.log(err);
            }
        };
        dependentStateAndCity();
    },[formValue?.State,formValue?.Country]);

    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">
                                {isEditing ? "Update cruise company " : "Add cruise company"}
                            </h4>
                            <button className="btn btn-dark btn-custom-size text-end" onClick={() => navigate(-1)}>
                                <span className="me-1">Back</span>
                                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="form-validation" ref={formRef}>
                                <ToastContainer />
                                <form className="form-valide" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row form-row-gap">
                                                <div className="col-md-6 col-lg-2">
                                                    <label htmlFor="CruiseCompanyName">
                                                        Cruise Company Name
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control form-control-sm ${validationErrors?.CruiseCompanyName ? "is-invalid" : ""
                                                            }`}
                                                        name="CruiseCompanyName"
                                                        placeholder="Enter CruiseCompanyName"
                                                        value={formValue?.CruiseCompanyName}
                                                        onChange={handleFormChange}
                                                    />
                                                    {validationErrors?.CruiseCompanyName && (
                                                        <div
                                                            className="invalid-feedback animated fadeInUp"
                                                            style={{ display: "block" }}
                                                        >
                                                            {validationErrors?.CruiseCompanyName}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 col-lg-2">
                                                    <label htmlFor="Destination">
                                                        Destination
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    <select
                                                        name="Destination"
                                                        placeholder="Enter Destination"
                                                        className={`form-control form-control-sm ${validationErrors?.Destination ? "is-invalid" : ""
                                                            }`}
                                                        value={formValue?.Destination}
                                                        onChange={handleFormChange}
                                                    >
                                                        <option value="">select</option>
                                                        {Destinationlist?.map((value,index) => {
                                                            return (
                                                                <option value={value.id} key={index + 1}>
                                                                    {value.Name}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>

                                                    {validationErrors?.Destination && (
                                                        <div
                                                            className="invalid-feedback animated fadeInUp"
                                                            style={{ display: "block" }}
                                                        >
                                                            {validationErrors?.Destination}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="d-flex justify-content-between">
                                                        <label className="m-0">
                                                            Country <span className="text-danger">*</span>
                                                        </label>
                                                    </div>
                                                    <select
                                                        className="form-control form-control-sm"
                                                        component={"select"}
                                                        name="Country"
                                                        value={formValue?.Country}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value={""}>Select</option>
                                                        {countryList?.map((value,index) => {
                                                            return (
                                                                <option value={value.id} key={index + 1}>
                                                                    {value?.Name}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                    {validationErrors?.Country && (
                                                        <div
                                                            id="val-username1-error"
                                                            className="invalid-feedback animated fadeInUp"
                                                            style={{ display: "block" }}
                                                        >
                                                            {validationErrors?.Country}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <label className="m-0">State</label>
                                                    <select
                                                        className="form-control form-control-sm"
                                                        component={"select"}
                                                        name="State"
                                                        value={formValue?.State}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value={""}>Select</option>
                                                        {stateList?.map((item,ind) => {
                                                            return (
                                                                <option value={item?.id} key={ind + 1}>
                                                                    {item?.Name}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                    {validationErrors?.State && (
                                                        <div
                                                            id="val-username1-error"
                                                            className="invalid-feedback animated fadeInUp"
                                                            style={{ display: "block" }}
                                                        >
                                                            {validationErrors?.State}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 col-lg-2" >
                                                    <label htmlFor="City">
                                                        City
                                                    </label> <select
                                                        className="form-control form-control-sm"
                                                        component={"select"}
                                                        name="City"
                                                        value={formValue?.City}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value={""}>Select</option>
                                                        {cityList?.map((item,ind) => {
                                                            return (
                                                                <option value={item?.id} key={ind + 1}>
                                                                    {item?.Name}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                    {validationErrors?.City && (
                                                        <div
                                                            id="val-username1-error"
                                                            className="invalid-feedback animated fadeInUp"
                                                            style={{ display: "block" }}
                                                        >
                                                            {validationErrors?.City}
                                                        </div>
                                                    )}

                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <label className="m-0">City</label>
                                                    <select
                                                        className="form-control form-control-sm"
                                                        component={"select"}
                                                        name="City"
                                                        value={formValue?.City}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value={""}>Select</option>
                                                        {cityList?.map((item,ind) => {
                                                            return (
                                                                <option value={item?.id} key={ind + 1}>
                                                                    {item?.Name}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="col-md-6 col-lg-2" >
                                                    <label htmlFor="City">
                                                        Pin Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control form-control-sm ${validationErrors?.PinCode ? "is-invalid" : ""
                                                            }`}
                                                        name="PinCode"
                                                        placeholder="Enter PinCode"
                                                        value={formValue?.PinCode}
                                                        onChange={handleFormChange}
                                                    />
                                                    {validationErrors?.PinCode && (
                                                        <div
                                                            className="invalid-feedback animated fadeInUp"
                                                            style={{ display: "block" }}
                                                        >
                                                            {validationErrors?.PinCode}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 col-lg-2" >
                                                    <label htmlFor="Address">
                                                        Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control form-control-sm ${validationErrors?.Address ? "is-invalid" : ""
                                                            }`}
                                                        name="Address"
                                                        placeholder="Enter Address"
                                                        value={formValue?.Address}
                                                        onChange={handleFormChange}
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
                                                <div className="col-md-6 col-lg-2" >
                                                    <label htmlFor="Website">
                                                        Website
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control form-control-sm ${validationErrors?.Website ? "is-invalid" : ""
                                                            }`}
                                                        name="Website"
                                                        placeholder="Enter Website"
                                                        value={formValue?.Website}
                                                        onChange={handleFormChange}
                                                    />
                                                    {validationErrors?.Website && (
                                                        <div
                                                            className="invalid-feedback animated fadeInUp"
                                                            style={{ display: "block" }}
                                                        >
                                                            {validationErrors?.Website}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 col-lg-2" >
                                                    <label htmlFor="City">
                                                        GST
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control form-control-sm ${validationErrors?.GST ? "is-invalid" : ""
                                                            }`}
                                                        name="GST"
                                                        placeholder="Enter GST"
                                                        value={formValue?.GST}
                                                        onChange={handleFormChange}
                                                    />
                                                    {validationErrors?.GST && (
                                                        <div
                                                            className="invalid-feedback animated fadeInUp"
                                                            style={{ display: "block" }}
                                                        >
                                                            {validationErrors?.GST}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 col-lg-2">
                                                    <label htmlFor="SelfSupplier">
                                                        Self Supplier
                                                    </label>
                                                    <select
                                                        name="SelfSupplier"
                                                        placeholder="Enter Cruise Company"
                                                        className={`form-control form-control-sm ${validationErrors?.SelfSupplier ? "is-invalid" : ""
                                                            }`}
                                                        value={formValue?.SelfSupplier}
                                                        onChange={handleFormChange}
                                                    >
                                                        <option value="">select</option>
                                                        <option value={"Yes"}>Yes</option>
                                                        <option value={"No"}>No</option>

                                                    </select>

                                                    {validationErrors?.CruiseCompany && (
                                                        <div
                                                            className="invalid-feedback animated fadeInUp"
                                                            style={{ display: "block" }}
                                                        >
                                                            {validationErrors?.CruiseCompany}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 col-lg-2" >
                                                    <label htmlFor="Type">
                                                        Type
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control form-control-sm ${validationErrors?.Type ? "is-invalid" : ""
                                                            }`}
                                                        name="Type"
                                                        placeholder="Enter Type"
                                                        value={formValue?.Type}
                                                        onChange={handleFormChange}
                                                    />
                                                    {validationErrors?.Type && (
                                                        <div
                                                            className="invalid-feedback animated fadeInUp"
                                                            style={{ display: "block" }}
                                                        >
                                                            {validationErrors?.Type}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 col-lg-2" >
                                                    <label htmlFor="Phone">
                                                        Phone
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control form-control-sm ${validationErrors?.Phone ? "is-invalid" : ""
                                                            }`}
                                                        name="Phone"
                                                        placeholder="Enter Phone number"
                                                        value={formValue?.Phone}
                                                        onChange={handleFormChange}
                                                    />
                                                    {validationErrors?.Phone && (
                                                        <div
                                                            className="invalid-feedback animated fadeInUp"
                                                            style={{ display: "block" }}
                                                        >
                                                            {validationErrors?.Phone}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 col-lg-2" >
                                                    <label htmlFor="Email">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="Email"
                                                        className={`form-control form-control-sm ${validationErrors?.Email ? "is-invalid" : ""
                                                            }`}
                                                        name="Email"
                                                        placeholder="Enter Email number"
                                                        value={formValue?.Email}
                                                        onChange={handleFormChange}
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
                                                    <label>Status</label>
                                                    <select
                                                        name="Status"
                                                        className="form-control form-control-sm"
                                                        value={formValue?.Status}
                                                        onChange={handleFormChange}
                                                    >
                                                        <option value="1">Active</option>
                                                        <option value="0">Inactive</option>
                                                    </select>
                                                </div>



                                                <div className="col-md-6 col-lg-2 d-flex align-items-center">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary btn-custom-size"
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

export default CruiseCompany;
