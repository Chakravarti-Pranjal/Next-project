import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import { axiosOther } from "../../../../http/axios_base_url";
import { notifyError, notifySuccess } from "../../../../helper/notify";

const AddTaskSchedulingTemplate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        id: "",
        HotelName: "",
        Status: "Active",
        SetDefault: "No",
        services: [
            {
                HotelChain: "",
                ServiceId: null,
                type: "Travel",
                TravleStartDaysType: "",
                TravelCompeleteDaysType: "",
                BookingStartDaysType: "",
                BookingCompeleteDaysType: "",
            },
        ],
    });
    const [productList, setProductList] = useState([]);
    const [companyId, setCompanyId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        getListDataToServer();
        // Extract companyKey from token and set as CompanyId
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const tokenData = JSON.parse(token);
                setCompanyId(tokenData.companyKey);
            } catch (error) {
                console.error("Error parsing token:", error);
            }
        }

        // Pre-fill form data if editing
        const editData = location.state;
        if (editData) {
            setFormData({
                id: editData.id || "",
                HotelName: editData.Name || "",
                Status: editData.Status === "Active" ? "Active" : "Inactive",
                SetDefault: editData.SetDefault || "",
                services: editData.ServiceDetails?.map((service) => ({
                    HotelChain: service.ServiceId || "",
                    ServiceId: service.ServiceId || null,
                    type:
                        service.TravleStartDaysType || service.TravelCompeleteDaysType
                            ? "Travel"
                            : service.BookingStartDaysType || service.BookingCompeleteDaysType
                                ? "Booking"
                                : "Travel",
                    TravleStartDaysType: service.TravleStartDaysType || "",
                    TravelCompeleteDaysType: service.TravelCompeleteDaysType || "",
                    BookingStartDaysType: service.BookingStartDaysType || "",
                    BookingCompeleteDaysType: service.BookingCompeleteDaysType || "",
                })) || [
                        {
                            HotelChain: "",
                            ServiceId: null,
                            type: "Travel",
                            TravleStartDaysType: "",
                            TravelCompeleteDaysType: "",
                            BookingStartDaysType: "",
                            BookingCompeleteDaysType: "",
                        },
                    ],
            });
        }
    }, [location.state]);

    const getListDataToServer = async () => {
        try {
            const productRes = await axiosOther.post("listproduct");
            const productListData = productRes?.data?.Datalist || [];
            setProductList(productListData);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (field === "HotelName" && value.trim() === "") {
            setError("Template name is required");
        } else if (field === "HotelName") {
            setError("");
        }
    };

    const handleServiceChange = (index, field, value) => {
        const updatedServices = [...formData.services];
        updatedServices[index][field] = value;
        setFormData((prev) => ({ ...prev, services: updatedServices }));
    };

    const handleDaysChange = (index, field, value, sign) => {
        const updatedServices = [...formData.services];
        updatedServices[index][field] = `${sign}${Math.abs(parseInt(value) || 0)}`;
        setFormData((prev) => ({ ...prev, services: updatedServices }));
    };

    const handleTypeChange = (index, value) => {
        const updatedServices = [...formData.services];
        const service = updatedServices[index];
        if (value === "Travel") {
            service.TravleStartDaysType = service.TravleStartDaysType || "+0";
            service.TravelCompeleteDaysType = service.TravelCompeleteDaysType || "+0";
            service.BookingStartDaysType = "";
            service.BookingCompeleteDaysType = "";
        } else if (value === "Booking") {
            service.BookingStartDaysType = service.BookingStartDaysType || "+0";
            service.BookingCompeleteDaysType = service.BookingCompeleteDaysType || "+0";
            service.TravleStartDaysType = "";
            service.TravelCompeleteDaysType = "";
        }
        service.type = value;
        setFormData((prev) => ({ ...prev, services: updatedServices }));
    };

    const handleAddForm = () => {
        setFormData((prev) => ({
            ...prev,
            services: [
                ...prev.services,
                {
                    HotelChain: "",
                    ServiceId: null,
                    type: "Travel",
                    TravleStartDaysType: "",
                    TravelCompeleteDaysType: "",
                    BookingStartDaysType: "",
                    BookingCompeleteDaysType: "",
                },
            ],
        }));
    };

    const handleRemoveForm = (index) => {
        if (formData.services.length > 1) {
            const updatedServices = formData.services.filter((_, i) => i !== index);
            setFormData((prev) => ({ ...prev, services: updatedServices }));
        }
    };

    const handleReset = () => {
        setFormData({
            id: "",
            HotelName: "",
            Status: "Active",
            SetDefault: "",
            services: [
                {
                    HotelChain: "",
                    ServiceId: null,
                    type: "Travel",
                    TravleStartDaysType: "",
                    TravelCompeleteDaysType: "",
                    BookingStartDaysType: "",
                    BookingCompeleteDaysType: "",
                },
            ],
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!companyId) {
            console.error("CompanyId is not set");
            return;
        }

        if (!formData.HotelName.trim()) {
            setError("Template name is required");
            return;
        }

        const payload = {
            id: formData.id || "",
            Name: formData.HotelName,
            CompanyId: companyId,
            Status: formData.Status === "Active" ? 1 : 0,
            SetDefault: formData.SetDefault,
            AddedBy: 1, // Replace with actual user ID if available
            ServiceDetails: formData.services.map((service) => ({
                ServiceId: service.HotelChain || null,
                TravleStartDaysType: service.TravleStartDaysType,
                TravelCompeleteDaysType: service.TravelCompeleteDaysType,
                BookingStartDaysType: service.BookingStartDaysType,
                BookingCompeleteDaysType: service.BookingCompeleteDaysType,
            })),
        };

        try {
            const { data } = await axiosOther.post("store-taskscheduling", payload);
            console.log(data);

            if (data?.Status == 1) {
                // notifySuccess("Template saved successfully");
                notifySuccess(data?.Message);
                navigate(-1);
            }
            if (data?.Status == 0) {
                notifyError(data?.Message?.Name[0])
            }
        } catch (error) {
            console.error("API Error:", error);
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <div className="card-header mb-2">
                    <h3 className="mb-0">Add Task Scheduling Template</h3>
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
                        <button
                            onClick={handleReset}
                            className="btn btn-secondary btn-custom-size"
                        >
                            Reset
                        </button>
                    </div>
                </div>
                <div className="form-validation">
                    <form
                        className="form-valide"
                        action="#"
                        method="post"
                        onSubmit={handleSubmit}
                    >
                        <div className="row form-row-gap mb-3 ">
                            <div className="col-md-6 col-lg-2">
                                <label className="m-0">Template Name</label>
                                <input
                                    type="text"
                                    placeholder="Template Name"
                                    className="form-control form-control-sm"
                                    name="HotelName"
                                    value={formData.HotelName}
                                    onChange={(e) =>
                                        handleInputChange("HotelName", e.target.value)
                                    }
                                    required
                                />
                                {error && <span style={{ color: "red", fontSize: "0.8rem" }}>{error}</span>}
                            </div>
                            <div className="col-md-6 col-lg-2">
                                <label className="m-0">Status</label>
                                <select
                                    className="form-control form-control-sm"
                                    value={formData.Status}
                                    onChange={(e) => handleInputChange("Status", e.target.value)}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="col-md-6 col-lg-2">
                                <div className="position-relative mt-2">
                                    <span
                                        className="position-absolute px-2 dateCardFeildSet SchedulingTask"
                                        style={{
                                            top: "-0.45rem",
                                            left: "0.3rem",
                                            fontSize: "0.55rem",
                                            zIndex: 1,
                                        }}
                                    >
                                        Set Default
                                    </span>
                                    <div className="row border rounded px-2 py-2 pe-3 me-3">
                                        <div className="col-6 d-flex gap-3">
                                            <div className="d-flex gap-3">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="SetDefault"
                                                        id="defaultYes"
                                                        value="Yes"
                                                        checked={formData.SetDefault === "Yes"}
                                                        onChange={(e) => handleInputChange("SetDefault", e.target.value)}
                                                    />
                                                    <label className="form-check-label fs-6" htmlFor="defaultYes">
                                                        Yes
                                                    </label>
                                                </div>

                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="SetDefault"
                                                        id="defaultNo"
                                                        value="No"
                                                        checked={formData.SetDefault === "No"}
                                                        onChange={(e) => handleInputChange("SetDefault", e.target.value)}
                                                    />
                                                    <label className="form-check-label fs-6" htmlFor="defaultNo">
                                                        No
                                                    </label>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {formData.services.map((service, index) => (
                            <div key={index} className="row form-row-gap mb-3">
                                <div className="col-md-6 col-lg-2">
                                    <label className="m-0">Services</label>
                                    <select
                                        className="form-control form-control-sm"
                                        name="HotelChain"
                                        value={service.HotelChain}
                                        onChange={(e) =>
                                            handleServiceChange(index, "HotelChain", e.target.value)
                                        }
                                    >
                                        <option value="">Select</option>
                                        {productList.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 col-lg-2 me-1">
                                    <label className="m-0">Type</label>
                                    <select
                                        className="form-control form-control-sm"
                                        value={service.type}
                                        onChange={(e) => handleTypeChange(index, e.target.value)}
                                    >
                                        <option value="Travel">Travel</option>
                                        <option value="Booking">Booking</option>
                                    </select>
                                </div>
                                {service.type === "Travel" && (
                                    <>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="position-relative mt-2">
                                                <span
                                                    className="position-absolute px-2 dateCardFeildSet SchedulingTask"
                                                    style={{
                                                        top: "-0.45rem",
                                                        left: "0.3rem",
                                                        fontSize: "0.55rem",
                                                        zIndex: 1,
                                                    }}
                                                >
                                                    Travel Start Days
                                                </span>
                                                <div className="row border rounded px-2 py-2 pe-3 me-3">
                                                    <div className="col-12 d-flex gap-3">
                                                        <div className="d-flex gap-3">
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name={`TravleStartDaysType_${index}_sign`}
                                                                    value="-"
                                                                    id={`TravleStartDaysType_minus_${index}`}
                                                                    checked={service.TravleStartDaysType.startsWith("-")}
                                                                    onChange={() =>
                                                                        handleDaysChange(
                                                                            index,
                                                                            "TravleStartDaysType",
                                                                            service.TravleStartDaysType.replace(/^[+-]/, ""),
                                                                            "-"
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    className="form-check-label fs-5"
                                                                    htmlFor={`TravleStartDaysType_minus_${index}`}
                                                                >
                                                                    -
                                                                </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name={`TravleStartDaysType_${index}_sign`}
                                                                    value="+"
                                                                    id={`TravleStartDaysType_plus_${index}`}
                                                                    checked={service.TravleStartDaysType.startsWith("+")}
                                                                    onChange={() =>
                                                                        handleDaysChange(
                                                                            index,
                                                                            "TravleStartDaysType",
                                                                            service.TravleStartDaysType.replace(/^[+-]/, ""),
                                                                            "+"
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    className="form-check-label fs-5"
                                                                    htmlFor={`TravleStartDaysType_plus_${index}`}
                                                                >
                                                                    +
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="number"
                                                            placeholder="0"
                                                            className="form-control form-control-sm"
                                                            value={service.TravleStartDaysType.replace(/^[+-]/, "")}
                                                            onChange={(e) =>
                                                                handleDaysChange(
                                                                    index,
                                                                    "TravleStartDaysType",
                                                                    e.target.value,
                                                                    service.TravleStartDaysType.startsWith("-") ? "-" : "+"
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="position-relative mt-2">
                                                <span
                                                    className="position-absolute px-2 dateCardFeildSet SchedulingTask"
                                                    style={{
                                                        top: "-0.45rem",
                                                        left: "0.3rem",
                                                        fontSize: "0.55rem",
                                                        zIndex: 1,
                                                    }}
                                                >
                                                    Travel Complete Days
                                                </span>
                                                <div className="row border rounded px-2 py-2 pe-3 me-3">
                                                    <div className="col-12 d-flex gap-3">
                                                        <div className="d-flex gap-3">
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name={`TravelCompeleteDaysType_${index}_sign`}
                                                                    value="-"
                                                                    id={`TravelCompeleteDaysType_minus_${index}`}
                                                                    checked={service.TravelCompeleteDaysType.startsWith("-")}
                                                                    onChange={() =>
                                                                        handleDaysChange(
                                                                            index,
                                                                            "TravelCompeleteDaysType",
                                                                            service.TravelCompeleteDaysType.replace(/^[+-]/, ""),
                                                                            "-"
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    className="form-check-label fs-5"
                                                                    htmlFor={`TravelCompeleteDaysType_minus_${index}`}
                                                                >
                                                                    -
                                                                </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name={`TravelCompeleteDaysType_${index}_sign`}
                                                                    value="+"
                                                                    id={`TravelCompeleteDaysType_plus_${index}`}
                                                                    checked={service.TravelCompeleteDaysType.startsWith("+")}
                                                                    onChange={() =>
                                                                        handleDaysChange(
                                                                            index,
                                                                            "TravelCompeleteDaysType",
                                                                            service.TravelCompeleteDaysType.replace(/^[+-]/, ""),
                                                                            "+"
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    className="form-check-label fs-5"
                                                                    htmlFor={`TravelCompeleteDaysType_plus_${index}`}
                                                                >
                                                                    +
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="number"
                                                            placeholder="0"
                                                            className="form-control form-control-sm"
                                                            value={service.TravelCompeleteDaysType.replace(/^[+-]/, "")}
                                                            onChange={(e) =>
                                                                handleDaysChange(
                                                                    index,
                                                                    "TravelCompeleteDaysType",
                                                                    e.target.value,
                                                                    service.TravelCompeleteDaysType.startsWith("-") ? "-" : "+"
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {service.type === "Booking" && (
                                    <>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="position-relative mt-2">
                                                <span
                                                    className="position-absolute px-2 dateCardFeildSet SchedulingTask"
                                                    style={{
                                                        top: "-0.45rem",
                                                        left: "0.3rem",
                                                        fontSize: "0.55rem",
                                                        zIndex: 1,
                                                    }}
                                                >
                                                    Booking Start Days
                                                </span>
                                                <div className="row border rounded px-2 py-2 pe-3 me-3">
                                                    <div className="col-12 d-flex gap-3">
                                                        <div className="d-flex gap-3">
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name={`BookingStartDaysType_${index}_sign`}
                                                                    value="-"
                                                                    id={`BookingStartDaysType_minus_${index}`}
                                                                    checked={service.BookingStartDaysType.startsWith("-")}
                                                                    onChange={() =>
                                                                        handleDaysChange(
                                                                            index,
                                                                            "BookingStartDaysType",
                                                                            service.BookingStartDaysType.replace(/^[+-]/, ""),
                                                                            "-"
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    className="form-check-label fs-5"
                                                                    htmlFor={`BookingStartDaysType_minus_${index}`}
                                                                >
                                                                    -
                                                                </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name={`BookingStartDaysType_${index}_sign`}
                                                                    value="+"
                                                                    id={`BookingStartDaysType_plus_${index}`}
                                                                    checked={service.BookingStartDaysType.startsWith("+")}
                                                                    onChange={() =>
                                                                        handleDaysChange(
                                                                            index,
                                                                            "BookingStartDaysType",
                                                                            service.BookingStartDaysType.replace(/^[+-]/, ""),
                                                                            "+"
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    className="form-check-label fs-5"
                                                                    htmlFor={`BookingStartDaysType_plus_${index}`}
                                                                >
                                                                    +
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="number"
                                                            placeholder="0"
                                                            className="form-control form-control-sm"
                                                            value={service.BookingStartDaysType.replace(/^[+-]/, "")}
                                                            onChange={(e) =>
                                                                handleDaysChange(
                                                                    index,
                                                                    "BookingStartDaysType",
                                                                    e.target.value,
                                                                    service.BookingStartDaysType.startsWith("-") ? "-" : "+"
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-2">
                                            <div className="position-relative mt-2">
                                                <span
                                                    className="position-absolute px-2 dateCardFeildSet SchedulingTask"
                                                    style={{
                                                        top: "-0.45rem",
                                                        left: "0.3rem",
                                                        fontSize: "0.55rem",
                                                        zIndex: 1,
                                                    }}
                                                >
                                                    Booking Complete Days
                                                </span>
                                                <div className="row border rounded px-2 py-2 pe-3 me-3">
                                                    <div className="col-12 d-flex gap-3">
                                                        <div className="d-flex gap-3">
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name={`BookingCompeleteDaysType_${index}_sign`}
                                                                    value="-"
                                                                    id={`BookingCompeleteDaysType_minus_${index}`}
                                                                    checked={service.BookingCompeleteDaysType.startsWith("-")}
                                                                    onChange={() =>
                                                                        handleDaysChange(
                                                                            index,
                                                                            "BookingCompeleteDaysType",
                                                                            service.BookingCompeleteDaysType.replace(/^[+-]/, ""),
                                                                            "-"
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    className="form-check-label fs-5"
                                                                    htmlFor={`BookingCompeleteDaysType_minus_${index}`}
                                                                >
                                                                    -
                                                                </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name={`BookingCompeleteDaysType_${index}_sign`}
                                                                    value="+"
                                                                    id={`BookingCompeleteDaysType_plus_${index}`}
                                                                    checked={service.BookingCompeleteDaysType.startsWith("+")}
                                                                    onChange={() =>
                                                                        handleDaysChange(
                                                                            index,
                                                                            "BookingCompeleteDaysType",
                                                                            service.BookingCompeleteDaysType.replace(/^[+-]/, ""),
                                                                            "+"
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    className="form-check-label fs-5"
                                                                    htmlFor={`BookingCompeleteDaysType_plus_${index}`}
                                                                >
                                                                    +
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="number"
                                                            placeholder="0"
                                                            className="form-control form-control-sm"
                                                            value={service.BookingCompeleteDaysType.replace(/^[+-]/, "")}
                                                            onChange={(e) =>
                                                                handleDaysChange(
                                                                    index,
                                                                    "BookingCompeleteDaysType",
                                                                    e.target.value,
                                                                    service.BookingCompeleteDaysType.startsWith("-") ? "-" : "+"
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className={`${styles.actions} col-md-1 col-lg-1 mt-1`}>
                                    {/* {index === formData.services.length - 1 ? ( */}
                                    {index === 0 ? (

                                        <button
                                            type="button"
                                            className={styles.addBtn}
                                            onClick={handleAddForm}
                                        >
                                            +
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className={styles.removeBtn}
                                            onClick={() => handleRemoveForm(index)}
                                        >
                                            -
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTaskSchedulingTemplate;