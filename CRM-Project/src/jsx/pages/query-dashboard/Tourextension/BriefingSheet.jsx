import React, { useEffect, useRef, useState } from "react";
import { Container, Button } from "react-bootstrap";
import html2pdf from "html2pdf.js";
import logo from "/invoice/deboxlogo.png";
import { axiosOther } from "../../../../http/axios_base_url";
import { notifySuccess } from "../../../../helper/notify";
import { useLocation, useNavigate } from "react-router-dom";

// Utility function to convert 12-hour AM/PM time to 24-hour format
const convertTo24HourFormat = (time12Hour) => {
    if (!time12Hour) return "";
    try {
        const [time, period] = time12Hour.split(" ");
        let [hours, minutes] = time.split(":");
        hours = parseInt(hours, 10);
        if (period === "PM" && hours !== 12) {
            hours += 12;
        } else if (period === "AM" && hours === 12) {
            hours = 0;
        }
        return `${hours.toString().padStart(2, "0")}:${minutes}`;
    } catch (error) {
        console.error("Error converting time format:", error);
        return time12Hour; // Fallback to original if conversion fails
    }
};

const BriefingSheet = () => {
    const pdfRef = useRef();
    const data = localStorage.getItem("Query_Qoutation");
    const parsedData = JSON.parse(data);
    const [mealPlanList, setMealPlanList] = useState([]);
    const [companylogo, setcompanylogo] = useState([]);
    const navigate = useNavigate();
    const { state } = useLocation();
    const [getData, setGetData] = useState();
    const queryQuotation = JSON.parse(localStorage.getItem("token"));
    const [formData, setFormData] = useState({
        QueryId: parsedData.QueryID,
        QuotationNumber: parsedData?.QoutationNum,
        ReferenceId: parsedData?.ReferenceId,
        TourId: parsedData?.TourId,
        Status: "1",
        Date: "",
        FileCode: "",
        NameOfGroup: "",
        NoOfPax: "",
        NameOfForeignerAgent: "",
        TourLeader: "",
        FlightNo: "",
        ArrivalTime: "", // Corrected from ArrivelTime
        Itinenary: "Yes",
        Vouchers: "Yes",
        FlightTickets: "Yes",
        TrainTickets: "Yes",
        Hotel: "",
        CheckIn: "",
        RoomCategory: "",
        CheckOut: "",
        HotelReconfirmedBy: "",
        reconfirmedOn: "",
        MealPlanId: "",
        sightseeingA: "",
        sightseeingB: "",
        PickupTime: "",
        NameOfGuide: "",
        MobileNo: "",
        HotelReconfirmedDate: "",
        HotelReconfirmedTime: "",
        FlightReconfirmationDate: "",
        FlightReconfirmationTime: "",
        ToCollectPayment: "",
        ToCollectFlightTickets: "Yes",
        TransportId: "",
        TransportRepName: "",
        VehicleType: "",
        VehicleNumber: "",
        DriverName: "",
        AirpostEntryTime: "",
        DriverMobile: "",
        Punctuality: [],
        Cleanliness: [],
        DriverUniform: "",
        FeedbackFormCollected: "",
        OtherComments: "",
        FileHandler: "",
        PhoneNo: "",
        id: "",
    });
    // console.log(state, "state")
    // console.log(formData, "state1")
    console.log(getData, "getData")
    const getDataForDropdown = async () => {
        try {
            const { data } = await axiosOther.post("hotelmealplanlist", {
                Search: "",
                Status: "",
            });
            setMealPlanList(data?.DataList);
        } catch (error) {
            console.log(error);
        }
        try {
            const { data } = await axiosOther.post("listwithquotation-briffing-sheet", {
                QueryId: parsedData?.QueryID,
                QuotationNumber: parsedData?.QoutationNum,
            });
            setGetData(data?.DataList[0]);
        } catch (error) {
            console.log(error);
        }
        try {
            const { data } = await axiosOther.post("listCompanySetting", {
                id: "",
                CompanyId: queryQuotation?.companyKey,
                Key: "mainlogo"
            });
            setcompanylogo(data?.DataList[0]);
        } catch (error) {
            console.log(error);
        }
    };
    console.log(queryQuotation, "setcompanylogo")
    useEffect(() => {
        getDataForDropdown();
    }, []);

    useEffect(() => {
        if (state) {
            // console.log(state, "statestate")
            // If state is present (e.g., editing an existing briefing sheet)
            setFormData({
                id: state?.id,
                QueryId: state?.QueryId,
                QuotationNumber: state?.QuotationNumber,
                ReferenceId: state?.ReferenceId,
                TourId: state?.TourId,
                Status: state?.Status,
                Date: state?.BriffingSheetDetails?.Date,
                FileCode: state?.BriffingSheetDetails?.FileCode,
                NameOfGroup: state?.BriffingSheetDetails?.NameOfGroup,
                NoOfPax: state?.BriffingSheetDetails?.NoOfPax,
                NameOfForeignerAgent: state?.BriffingSheetDetails?.NameOfForeignerAgent,
                TourLeader: state?.BriffingSheetDetails?.TourLeader,
                FlightNo: state?.BriffingSheetDetails?.FlightNo,
                ArrivalTime: convertTo24HourFormat(state?.BriffingSheetDetails?.ArrivalTime), // Convert time
                Itinenary: state?.BriffingSheetDetails?.TravelDocument?.Itenary,
                Vouchers: state?.BriffingSheetDetails?.TravelDocument?.Vouchers,
                FlightTickets: state?.BriffingSheetDetails?.TravelDocument?.FlightTickets,
                TrainTickets: state?.BriffingSheetDetails?.TravelDocument?.TrainTickets,
                Hotel: state?.BriffingSheetDetails?.Accommodation?.Hotel,
                CheckIn: state?.BriffingSheetDetails?.Accommodation?.CheckIn,
                RoomCategory: state?.BriffingSheetDetails?.Accommodation?.RoomCategory,
                CheckOut: state?.BriffingSheetDetails?.Accommodation?.CheckOut,
                HotelReconfirmedBy: state?.BriffingSheetDetails?.Accommodation?.HotelReconfirmedBy,
                reconfirmedOn: "",
                MealPlanId: state?.BriffingSheetDetails?.Accommodation?.MealPlanId,
                sightseeingA: state?.Briefing,
                sightseeingB: "",
                PickupTime: state?.BriffingSheetDetails?.Transport?.PickupTime,
                NameOfGuide: state?.BriffingSheetDetails?.Transport?.NameOfGuide,
                MobileNo: state?.BriffingSheetDetails?.Transport?.MobileNo,
                HotelReconfirmedDate: state?.BriffingSheetDetails?.Instruction?.HotelReconfirmedDate,
                HotelReconfirmedTime: state?.BriffingSheetDetails?.Instruction?.HotelReconfirmedTime,
                FlightReconfirmationDate: state?.BriffingSheetDetails?.Instruction?.FlightReconfirmationDate,
                FlightReconfirmationTime: state?.BriffingSheetDetails?.Instruction?.FlightReconfirmationTime,
                ToCollectFlightTickets: state?.BriffingSheetDetails?.Instruction?.ToCollectFlightTickets,
                ToCollectPayment: state?.BriffingSheetDetails?.Instruction?.ToCollectPayment,
                Comments: state?.BriffingSheetDetails?.Comments?.Comments,
                TransportRepName: state?.BriffingSheetDetails?.Comments?.TransportRepName,
                VehicleType: state?.BriffingSheetDetails?.Comments?.VehicleType,
                VehicleNumber: state?.BriffingSheetDetails?.Comments?.VehicleNumber,
                DriverName: state?.BriffingSheetDetails?.Comments?.DriverName,
                AirpostEntryTime: state?.BriffingSheetDetails?.Comments?.AirpostEntryTime,
                DriverMobile: state?.BriffingSheetDetails?.Comments?.DriverMobile,
                Punctuality: state?.BriffingSheetDetails?.Comments?.Punctuality,
                Cleanliness: state?.BriffingSheetDetails?.Comments?.Cleanliness,
                DriverUniform: state?.BriffingSheetDetails?.Comments?.DriverUniform,
                FeedbackFormCollected: state?.BriffingSheetDetails?.Comments?.FeedbackFormCollected,
                OtherComments: state?.BriffingSheetDetails?.Comments?.OtherComments,
                FileHandler: state?.BriffingSheetDetails?.FileHandler,
                PhoneNo: state?.BriffingSheetDetails?.PhoneNo,
            });
        } else if (getData) {
            // If no state but getData is available (e.g., creating a new briefing sheet)
            setFormData({
                id: getData?.id || "",
                QueryId: getData?.QueryId || parsedData.QueryID,
                QuotationNumber: getData?.QuotationNumber || parsedData?.QoutationNum,
                ReferenceId: getData?.ReferenceId || parsedData?.ReferenceId,
                TourId: getData?.TourId || parsedData?.TourId,
                Status: getData?.Status || "1",
                Date: getData?.BriffingSheetDetails?.Date || "",
                FileCode: getData?.FileNo || "",
                NameOfGroup: getData?.BriffingSheetDetails?.NameOfGroup || "",
                NoOfPax: getData?.BriffingSheetDetails?.NoOfPax || "",
                NameOfForeignerAgent: getData?.BriffingSheetDetails?.ContactPersonName || "",
                TourLeader: getData?.BriffingSheetDetails?.TourLeader || "",
                FlightNo: getData?.BriffingSheetDetails?.FlightNo || "",
                ArrivalTime: convertTo24HourFormat(getData?.BriffingSheetDetails?.DepartureTime) || "", // Convert time
                Itinenary: getData?.TravelDocument?.Itenary || "Yes",
                Vouchers: getData?.TravelDocument?.Vouchers || "Yes",
                FlightTickets: getData?.TravelDocument?.FlightTickets || "Yes",
                TrainTickets: getData?.TravelDocument?.TrainTickets || "Yes",
                Hotel: getData?.BriffingSheetDetails?.Accommodation?.Hotel || "",
                CheckIn: getData?.BriffingSheetDetails?.Accommodation?.CheckIn || "",
                RoomCategory: getData?.BriffingSheetDetails?.Accommodation?.RoomCategoryName || "",
                CheckOut: getData?.BriffingSheetDetails?.Accommodation?.CheckOut || "",
                HotelReconfirmedBy: getData?.Accommodation?.HotelReconfirmedBy || "",
                MealPlanId: getData?.BriffingSheetDetails?.Accommodation?.MealPlanId || "",
                PickupTime: getData?.Transport?.PickupTime || "",
                NameOfGuide: getData?.Transport?.NameOfGuide || "",
                MobileNo: getData?.Transport?.MobileNo || "",
                HotelReconfirmedDate: getData?.Instruction?.HotelReconfirmedDate || "",
                HotelReconfirmedTime: getData?.Instruction?.HotelReconfirmedTime || "",
                FlightReconfirmationDate: getData?.Instruction?.FlightReconfirmationDate || "",
                FlightReconfirmationTime: getData?.Instruction?.FlightReconfirmationTime || "",
                ToCollectPayment: getData?.Instruction?.ToCollectPayment || "",
                ToCollectFlightTickets: getData?.Instruction?.ToCollectFlightTickets || "Yes",
                sightseeingA: getData?.sightseeingA || "",
                sightseeingB: getData?.sightseeingB || "",
                TransportId: getData?.TransportId || "",
                TransportRepName: getData?.TransportRepName || "",
                VehicleType: getData?.VehicleType || "",
                VehicleNumber: getData?.VehicleNumber || "",
                DriverName: getData?.DriverName || "",
                AirpostEntryTime: getData?.AirpostEntryTime || "",
                DriverMobile: getData?.DriverMobile || "",
                Punctuality: getData?.Punctuality || "",
                Cleanliness: getData?.Cleanliness || "",
                DriverUniform: getData?.DriverUniform || "",
                FeedbackFormCollected: getData?.FeedbackFormCollected || "",
                OtherComments: getData?.OtherComments || "",
                FileHandler: getData?.FileHandler || "",
                PhoneNo: getData?.PhoneNo || "",
            });
        }
    }, [state, getData]);

    const handleDownload = async () => {
        try {
            const payload = {
                ...formData,
            };
            const response = await axiosOther.post("addupdate-briffing-sheet", payload);
            if (response?.data?.Status === 201 || response?.data?.Status === 200) {
                notifySuccess(response?.data?.Message);
                const element = pdfRef.current;
                const opt = {
                    margin: 0,
                    filename: "briefing-sheet.pdf",
                    image: { type: "jpeg", quality: 1 },
                    html2canvas: { scale: 3 },
                    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
                };
                html2pdf().set(opt).from(element).save();
            } else {
                alert("Failed to save data before PDF generation.");
            }
            navigate("/query/tour-execution");
        } catch (error) {
            console.error("Error saving data or generating PDF:", error);
            alert("Something went wrong! Please try again.");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const labelStyle = {
        fontWeight: "bold",
        display: "inline-block",
        fontSize: "12px",
        marginRight: "10px",
    };

    const inputStyle = {
        border: "none",
        borderBottom: "1px solid black",
        backgroundColor: "transparent",
        padding: "0px 4px",
        width: "200px",
        outline: "none",
    };
    const smallInputStyle = {
        ...inputStyle,
        width: "60px",
    };
    const smallLabel = {
        fontWeight: "bold",
        minWidth: "50px",
        display: "inline-block",
    };

    const rowStyle = {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "12px",
    };

    const halfWidth = {
        width: "48%",
    };

    const sectionStyle = {
        borderTop: "2px solid black",
        paddingTop: "10px",
        marginTop: "20px",
        fontSize: "14px",
    };

    const colStyle = {
        width: "48%",
        display: "flex",
        alignItems: "center",
    };

    const smallLabelStyle = {
        fontWeight: "bold",
        marginRight: "8px",
        minWidth: "90px",
    };

    const checkboxGroupStyle = {
        display: "flex",
        alignItems: "center",
        gap: "6px",
    };
    const textareaStyle = {
        border: "1px solid #000",
        backgroundColor: "transparent",
        width: "100%",
        height: "60px",
        padding: "4px",
        resize: "vertical",
    };
    const handlePunctualityChange = (value) => {
        setFormData((prevData) => {
            const alreadySelected = prevData.Punctuality.includes(value);
            return {
                ...prevData,
                Punctuality: alreadySelected
                    ? prevData.Punctuality.filter((v) => v !== value)
                    : [...prevData.Punctuality, value],
            };
        });
    };
    const handleCleanlinessChange = (value) => {
        setFormData((prevData) => {
            const alreadySelected = prevData.Cleanliness.includes(value);
            return {
                ...prevData,
                Cleanliness: alreadySelected
                    ? prevData.Cleanliness.filter((v) => v !== value)
                    : [...prevData.Cleanliness, value],
            };
        });
    };
    const handleDriverUniformChange = (value) => {
        setFormData((prevData) => {
            const alreadySelected = prevData.DriverUniform.includes(value);
            return {
                ...prevData,
                DriverUniform: alreadySelected
                    ? prevData.DriverUniform.filter((v) => v !== value)
                    : [...prevData.DriverUniform, value],
            };
        });
    };
    const handleFeedbackFormCollectedChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            FeedbackFormCollected: prevData.FeedbackFormCollected === value ? "" : value,
        }));
    };

    return (
        <Container fluid className="">
            <div className="row pb-2">
                <div className="col-12 d-flex gap-3 justify-content-end w-100">
                    <button
                        className="btn btn-dark btn-custom-size"
                        name="SaveButton"
                        onClick={() => navigate(-1)}
                    >
                        <span className="me-1">Back</span>
                        <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                    </button>
                </div>
            </div>
            <div
                ref={pdfRef}
                style={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: "0.875rem",
                    lineHeight: 1.4,
                    background: "#fff",
                    color: "#000",
                    padding: "20px",
                }}
            >
                <img
                    width={100}
                    src={`${import.meta.env.VITE_LOGIN_URI_IMAGE}${companylogo?.Value?.ImageName}`}
                    style={{ display: "block", marginLeft: "auto" }}
                    alt="img"
                />
                <p
                    className="text-center fw-bold fs-4 mb-4 border-bottom mx-auto"
                    style={{ maxWidth: "max-content" }}
                >
                    BRIEFING SHEET FOR AIRPORT REPRESENTATIVE
                </p>

                <div style={{ fontSize: "14px", maxWidth: "100%" }}>
                    {/* Upper Form */}
                    <div style={rowStyle}>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Date:</label>
                            <input
                                type="text"
                                name="Date"
                                value={formData.Date}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={halfWidth}>
                            <label style={labelStyle}>File Code:</label>
                            <input
                                type="text"
                                name="FileCode"
                                value={formData.FileCode}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={rowStyle}>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Name of Group / FIT:</label>
                            <input
                                type="text"
                                name="NameOfGroup"
                                value={formData.NameOfGroup}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={halfWidth}>
                            <label style={labelStyle}>No of Pax:</label>
                            <input
                                type="text"
                                name="NoOfPax"
                                value={formData.NoOfPax}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={rowStyle}>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Name of Foreign Agent:</label>
                            <input
                                type="text"
                                name="NameOfForeignerAgent"
                                value={formData.NameOfForeignerAgent}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Name of Tour Leader:</label>
                            <input
                                type="text"
                                name="TourLeader"
                                value={formData.TourLeader}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={rowStyle}>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Flight No:</label>
                            <input
                                type="text"
                                name="FlightNo"
                                value={formData.FlightNo}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Arrival / Departure time:</label>
                            <input
                                type="time"
                                name="ArrivalTime"
                                value={formData.ArrivalTime}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Travel Documents Section */}
                    <div style={sectionStyle}>
                        <div
                            style={{
                                fontWeight: "bold",
                                textDecoration: "underline",
                                marginBottom: "10px",
                            }}
                        >
                            Travel Documents
                        </div>

                        <div style={rowStyle}>
                            <div style={colStyle}>
                                <span style={smallLabelStyle}>Itinerary:</span>
                                <div style={checkboxGroupStyle}>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"
                                        checked={formData.Itinenary === "Yes"}
                                        onChange={() => setFormData((prev) => ({ ...prev, Itinenary: "Yes" }))}
                                    />
                                    <span>Yes</span>
                                    <span>/</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"
                                        checked={formData.Itinenary === "No"}
                                        onChange={() => setFormData((prev) => ({ ...prev, Itinenary: "No" }))}
                                    />
                                    <span>No</span>
                                </div>
                            </div>

                            <div style={colStyle}>
                                <span style={smallLabelStyle}>Vouchers:</span>
                                <div style={checkboxGroupStyle}>
                                    <input
                                        type="checkbox"
                                        name="Vouchers"
                                        checked={formData.Vouchers === "Yes"}
                                        onChange={() => setFormData((prev) => ({ ...prev, Vouchers: "Yes" }))}
                                    />
                                    <span>Yes</span>
                                    <span>/</span>
                                    <input
                                        type="checkbox"
                                        name="Vouchers"
                                        checked={formData.Vouchers === "No"}
                                        onChange={() => setFormData((prev) => ({ ...prev, Vouchers: "No" }))}
                                    />
                                    <span>No</span>
                                </div>
                            </div>
                        </div>

                        <div style={rowStyle}>
                            <div style={colStyle}>
                                <span style={smallLabelStyle}>Flight tickets:</span>
                                <div style={checkboxGroupStyle}>
                                    <input
                                        type="checkbox"
                                        name="FlightTickets"
                                        checked={formData.FlightTickets === "Yes"}
                                        onChange={() => setFormData((prev) => ({ ...prev, FlightTickets: "Yes" }))}
                                    />
                                    <span>Yes</span>
                                    <span>/</span>
                                    <input
                                        type="checkbox"
                                        name="FlightTickets"
                                        checked={formData.FlightTickets === "No"}
                                        onChange={() => setFormData((prev) => ({ ...prev, FlightTickets: "No" }))}
                                    />
                                    <span>No</span>
                                </div>
                            </div>

                            <div style={colStyle}>
                                <span style={smallLabelStyle}>Train tickets:</span>
                                <div style={checkboxGroupStyle}>
                                    <input
                                        type="checkbox"
                                        name="TrainTickets"
                                        checked={formData.TrainTickets === "Yes"}
                                        onChange={() => setFormData((prev) => ({ ...prev, TrainTickets: "Yes" }))}
                                    />
                                    <span>Yes</span>
                                    <span>/</span>
                                    <input
                                        type="checkbox"
                                        name="TrainTickets"
                                        checked={formData.TrainTickets === "No"}
                                        onChange={() => setFormData((prev) => ({ ...prev, TrainTickets: "No" }))}
                                    />
                                    <span>No</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: "25px", fontSize: "14px" }}>
                    <div
                        style={{
                            fontWeight: "bold",
                            textDecoration: "underline",
                            marginBottom: "10px",
                        }}
                    >
                        Accommodation
                    </div>

                    <div style={rowStyle}>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Hotel:</label>
                            <input
                                type="text"
                                name="Hotel"
                                value={formData.Hotel}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Check-In:</label>
                            <input
                                type="date"
                                name="CheckIn"
                                value={formData.CheckIn}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={rowStyle}>
                        <div style={halfWidth}>
                            <label style={labelStyle}>No of Rooms / Room Category:</label>
                            <input
                                type="text"
                                name="RoomCategory"
                                value={formData.RoomCategory}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Check-Out:</label>
                            <input
                                type="date"
                                name="CheckOut"
                                value={formData.CheckOut}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={rowStyle}>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Hotel reconfirmed by:</label>
                            <input
                                type="text"
                                name="HotelReconfirmedBy"
                                value={formData.HotelReconfirmedBy}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={halfWidth}>
                            <label style={labelStyle}>On ( date ):</label>
                            <input
                                type="date"
                                name="reconfirmedOn"
                                value={formData.reconfirmedOn}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={rowStyle}>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Meal Plan:</label>
                            <select
                                name="MealPlanId"
                                id="status"
                                style={inputStyle}
                                value={formData?.MealPlanId}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                {mealPlanList &&
                                    mealPlanList?.length > 0 &&
                                    mealPlanList.map((data, index) => (
                                        <option value={data?.id} key={index}>
                                            {data?.Name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div style={sectionStyle}>
                    <div
                        style={{
                            fontWeight: "bold",
                            textDecoration: "underline",
                            marginBottom: "8px",
                        }}
                    >
                        Sightseeing
                    </div>

                    <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                        BY(AC Innova)
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>A.</div>
                        <textarea
                            style={textareaStyle}
                            name="sightseeingA"
                            value={formData.sightseeingA}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>B.</div>
                        <textarea
                            style={textareaStyle}
                            name="sightseeingB"
                            value={formData.sightseeingB}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                        <label style={labelStyle}>Pick up time from the Hotel:</label>
                        <input
                            type="time"
                            style={inputStyle}
                            name="PickupTime"
                            value={formData.PickupTime}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={rowStyle}>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Name of Guide / Escort:</label>
                            <input
                                type="text"
                                style={inputStyle}
                                name="NameOfGuide"
                                value={formData.NameOfGuide}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Mobile Number:</label>
                            <input
                                type="text"
                                style={inputStyle}
                                name="MobileNo"
                                value={formData.MobileNo}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
                <div style={sectionStyle}>
                    <div
                        style={{
                            fontWeight: "bold",
                            textDecoration: "underline",
                            marginBottom: "10px",
                        }}
                    >
                        Instructions to the Representative:
                    </div>

                    <div style={rowStyle}>
                        <div style={{ width: "48%" }}>
                            <label style={labelStyle}>Hotel Reconfirmed with:</label>
                        </div>
                        <div style={{ width: "48%" }}>
                            <label style={smallLabel}>Date:</label>
                            <input
                                type="date"
                                name="HotelReconfirmedDate"
                                value={formData.HotelReconfirmedDate}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                            <label style={{ ...smallLabel, marginLeft: "20px" }}>Time:</label>
                            <input
                                type="time"
                                name="HotelReconfirmedTime"
                                value={formData.HotelReconfirmedTime}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={rowStyle}>
                        <div style={{ width: "48%" }}>
                            <label style={labelStyle}>Flight Reconfirmation:</label>
                        </div>
                        <div style={{ width: "48%" }}>
                            <label style={smallLabel}>Date:</label>
                            <input
                                type="date"
                                name="FlightReconfirmationDate"
                                value={formData.FlightReconfirmationDate}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                            <label style={{ ...smallLabel, marginLeft: "20px" }}>Time:</label>
                            <input
                                type="time"
                                name="FlightReconfirmationTime"
                                value={formData.FlightReconfirmationTime}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                        <label style={labelStyle}>To collect any payment ( amount )</label>
                        <span style={{ fontWeight: "bold", marginRight: "6px" }}>USD:</span>
                        <input
                            type="text"
                            name="ToCollectPayment"
                            value={formData.ToCollectPayment}
                            onChange={handleChange}
                            style={smallInputStyle}
                        />
                    </div>

                    <div style={checkboxGroupStyle}>
                        <label style={labelStyle}>
                            To collect Flight tickets / photocopy of the flight tickets for
                            reconfirmation:
                        </label>
                        <div style={checkboxGroupStyle}>
                            <input
                                type="checkbox"
                                name="ToCollectFlightTickets"
                                checked={formData.ToCollectFlightTickets === "Yes"}
                                onChange={() =>
                                    setFormData((prev) => ({ ...prev, ToCollectFlightTickets: "Yes" }))
                                }
                            />
                            <span>Yes</span>
                            <span>/</span>
                            <input
                                type="checkbox"
                                name="ToCollectFlightTickets"
                                checked={formData.ToCollectFlightTickets === "No"}
                                onChange={() =>
                                    setFormData((prev) => ({ ...prev, ToCollectFlightTickets: "No" }))
                                }
                            />
                            <span>No</span>
                        </div>
                    </div>
                </div>
                <div style={sectionStyle}>
                    <div
                        style={{
                            fontWeight: "bold",
                            textDecoration: "underline",
                            marginBottom: "10px",
                        }}
                    >
                        Comments:
                    </div>
                    <div style={rowStyle}>
                        <div style={{ width: "48%" }}>
                            <label style={labelStyle}>a) Name of Transport representative:</label>
                            <input
                                type="text"
                                name="TransportRepName"
                                value={formData.TransportRepName}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ width: "48%" }}>
                            <div style={checkboxGroupStyle}>
                                <label style={labelStyle}>f) Punctuality of vehicle:</label>
                                <div style={checkboxGroupStyle}>
                                    {[5, 4, 3, 2, 1].map((value) => (
                                        <React.Fragment key={value}>
                                            <input
                                                type="checkbox"
                                                name="Punctuality"
                                                checked={formData.Punctuality?.includes(value)}
                                                onChange={() => handlePunctualityChange(value)}
                                            />
                                            <span>{value}</span>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={rowStyle}>
                        <div style={{ width: "48%" }}>
                            <label style={labelStyle}>b) Vehicle type:</label>
                            <input
                                type="text"
                                name="VehicleType"
                                value={formData.VehicleType}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ width: "48%" }}>
                            <div style={checkboxGroupStyle}>
                                <label style={labelStyle}>g) Cleanliness of vehicle:</label>
                                <div style={checkboxGroupStyle}>
                                    {[5, 4, 3, 2, 1].map((value) => (
                                        <React.Fragment key={value}>
                                            <input
                                                type="checkbox"
                                                name="Cleanliness"
                                                checked={formData.Cleanliness?.includes(value)}
                                                onChange={() => handleCleanlinessChange(value)}
                                            />
                                            <span>{value}</span>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={rowStyle}>
                        <div style={{ width: "48%" }}>
                            <label style={labelStyle}> c) Vehicle number & transporter:</label>
                            <input
                                type="text"
                                name="VehicleNumber"
                                value={formData.VehicleNumber}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ width: "48%" }}>
                            <div style={checkboxGroupStyle}>
                                <label style={labelStyle}>h) Driver's uniform & behaviour:</label>
                                <div style={checkboxGroupStyle}>
                                    {[5, 4, 3, 2, 1].map((value) => (
                                        <React.Fragment key={value}>
                                            <input
                                                type="checkbox"
                                                name="DriverUniform"
                                                checked={formData.DriverUniform?.includes(value)}
                                                onChange={() => handleDriverUniformChange(value)}
                                            />
                                            <span>{value}</span>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={rowStyle}>
                        <div style={{ width: "48%" }}>
                            <label style={labelStyle}>d) Driver name & cell number:</label>
                            <input
                                type="text"
                                name="DriverName"
                                value={formData.DriverName}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ width: "48%" }}>
                            <div style={checkboxGroupStyle}>
                                <label style={labelStyle}>
                                    i) Feedback form collected <br />
                                    from the guests / group leader:
                                </label>
                                <div style={checkboxGroupStyle}>
                                    <input
                                        type="checkbox"
                                        name="FeedbackFormCollected"
                                        checked={formData.FeedbackFormCollected === "Yes"}
                                        onChange={() => handleFeedbackFormCollectedChange("Yes")}
                                    />
                                    <span>Yes</span>
                                    <span>/</span>
                                    <input
                                        type="checkbox"
                                        name="FeedbackFormCollected"
                                        checked={formData.FeedbackFormCollected === "No"}
                                        onChange={() => handleFeedbackFormCollectedChange("No")}
                                    />
                                    <span>No</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={rowStyle}>
                        <div style={{ width: "48%" }}>
                            <label style={labelStyle}>e) Airport entry time:</label>
                            <input
                                type="time"
                                name="AirpostEntryTime"
                                value={formData.AirpostEntryTime}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ width: "48%" }}>
                            <label style={labelStyle}> j) Other comments:</label>
                            <input
                                type="text"
                                name="OtherComments"
                                value={formData.OtherComments}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                </div>
                <div style={sectionStyle}>
                    <div style={rowStyle}>
                        <div style={{ width: "48%" }}>
                            <label style={labelStyle}>File Handler :</label>
                            <input
                                type="text"
                                name="FileHandler"
                                value={formData.FileHandler}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ width: "48%" }}>
                            <label style={labelStyle}>Mobile Number :</label>
                            <input
                                type="number"
                                name="PhoneNo"
                                value={formData.PhoneNo}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Input form below (not printed) */}
            <div className="d-flex mt-4 justify-content-end">
                <Button className="btn btn-primary btn-sm" onClick={handleDownload}>
                    Download PDF
                </Button>
            </div>
        </Container>
    );
};

export default BriefingSheet;