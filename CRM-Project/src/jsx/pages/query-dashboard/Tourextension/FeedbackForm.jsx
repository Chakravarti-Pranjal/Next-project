import React, { useEffect, useRef, useState } from "react";
import { Container, Button } from "react-bootstrap";
import logo from "/invoice/deboxlogo.png";
import html2pdf from "html2pdf.js";
import { axiosOther } from "../../../../http/axios_base_url"; // Adjust the import path as needed
import { notifySuccess } from "../../../../helper/notify";
import { useNavigate, useLocation } from "react-router-dom";

const FeedbackForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rowData = location.state; // Data passed via navigation state
  const pdfRef = useRef();
  const data = localStorage.getItem("Query_Qoutation");
  const parsedData = JSON.parse(data) || {};
  const parsedCompanyId = JSON.parse(localStorage.getItem("query-data")) || {};

  const [destinationsWithServices, setDestinationsWithServices] = useState([]);
  const [queryQuotationData, setQueryQuotationData] = useState();
  console.log(queryQuotationData, "queryQuotationData");

  const [formData, setFormData] = useState({
    ReportDate: "",
    Name: "",
    ContactDetails: "",
    Email: "",
    TourDate: "",
    MoreAboutTrip: "",
    howdoyoulikeabouttrip: "",
    ImproveofTrips: "",
    RecomndationTrip: "",
    TravlewithNearFuture: "",
    ReceiveOfferAlerts: "",
    Comments: "",
    Rate: "",
    Services: [],
  });
  const [companylogo, setcompanylogo] = useState([]);

  // Initialize formData and destinationsWithServices with rowData if available
  useEffect(() => {
    if (rowData) {
      setFormData({
        ReportDate: rowData.Formdetails?.ReportDate || "",
        Name: rowData.Formdetails?.Name || "",
        ContactDetails: rowData.Formdetails?.ContactDetails || "",
        Email: rowData.Formdetails?.Email || "",
        TourDate: rowData.Formdetails?.TourDate || "",
        MoreAboutTrip: rowData.Formdetails?.MoreAboutTrip || "",
        howdoyoulikeabouttrip: rowData.Formdetails?.howdoyoulikeabouttrip || "",
        ImproveofTrips: rowData.Formdetails?.ImproveofTrips || "",
        RecomndationTrip: rowData.Formdetails?.RecomndationTrip || "",
        TravlewithNearFuture: rowData.Formdetails?.TravlewithNearFuture || "",
        ReceiveOfferAlerts: rowData.Formdetails?.ReceiveOfferAlerts || "",
        Comments: rowData.Formdetails?.Comments || "",
        Rate: rowData.Formdetails?.Rate || "",
        Services: rowData.Formdetails?.Services || [],
      });

      // Set destinations with services from rowData
      const destinations = rowData.Formdetails?.Services.map((dest) => ({
        DestinationName: dest.DestinationName || "Unknown Destination",
        Services: dest.ServiceDetails.map((service) => ({
          ServiceType: service.ServiceType || "",
          ServiceId: service.ServiceId || null,
          ServiceName: service.ServiceName || "",
          ServiceRate: service.ServiceRate || "",
        })),
      }));
      setDestinationsWithServices(destinations || []);
    }
  }, [rowData]);

  // Fetch additional data if needed (optional, depending on your use case)
  const fetchData = async () => {
    try {
      const { data } = await axiosOther.post("listqueryquotation", {
        QueryId: parsedData.QueryID,
        QuotationNo: parsedData.QoutationNum,
      });

      if (data?.data && data.data.length > 0 && !rowData) {
        // Only update if rowData is not available to avoid overwriting
        const destinations = data.data[0].Days.map((day) => ({
          DestinationName: day.DestinationName || "Unknown Destination",
          Services: day.DayServices.map((service) => ({
            ServiceType: service.ServiceType || "",
            ServiceId: service.ServiceId || "",
            ServiceName: service?.ServiceDetails[0]?.ItemName || "",
            ServiceRate: service.ServiceRate || "",
          })),
        }));
        setDestinationsWithServices(destinations);
        setQueryQuotationData(data?.data?.[0])
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!rowData) {
      fetchData(); // Fetch data only if rowData is not provided
    }
  }, [parsedData.QueryID, parsedData.QoutationNum, rowData]);

  const queryQuotation = JSON.parse(localStorage.getItem("token"));

  const getDataForDropdown = async () => {
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
  // console.log(queryQuotation, companylogo, "setcompanylogo")
  useEffect(() => {
    getDataForDropdown();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceFeedback = (destinationIndex, serviceIndex, value) => {
    setDestinationsWithServices((prev) => {
      const updatedDestinations = [...prev];
      updatedDestinations[destinationIndex].Services[serviceIndex].ServiceRate = value;
      return updatedDestinations;
    });
  };

  const handleRecommendation = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      id: rowData?.id || "", // Include id for update
      Companyid: String(parsedCompanyId.CompanyId) || "",
      QueryId: parsedData.QueryID || rowData?.QueryId || "",
      QuotationNo: parsedData.QoutationNum || rowData?.QuotationNo || "",
      TourId: queryQuotationData?.FileNo || rowData?.TourId || "",
      RefrenceNo: parsedData.ReferenceId || rowData?.RefrenceNo || "",
      AddedBy: "Admin",
      Formdetails: {
        ReportDate: formData.ReportDate,
        Name: formData.Name,
        ContactDetails: formData.ContactDetails,
        Email: formData.Email,
        TourDate: formData.TourDate,
        Services: destinationsWithServices.map((dest) => ({
          DestinationName: dest.DestinationName,
          ServiceDetails: dest.Services.map((service) => ({
            ServiceType: service.ServiceType,
            ServiceId: service.ServiceId,
            ServiceName: service.ServiceName,
            ServiceRate: service.ServiceRate,
          })),
        })),
        MoreAboutTrip: formData.MoreAboutTrip,
        howdoyoulikeabouttrip: formData.howdoyoulikeabouttrip,
        ImproveofTrips: formData.ImproveofTrips,
        RecomndationTrip: formData.RecomndationTrip,
        TravlewithNearFuture: formData.TravlewithNearFuture,
        ReceiveOfferAlerts: formData.ReceiveOfferAlerts,
        Comments: formData.Comments,
        Rate: formData.Rate,
      },
    };

    try {
      const endpoint = rowData?.id ? "updatefeedbackform" : "addfeedbackform";
      const response = await axiosOther.post(endpoint, payload);
      notifySuccess(response?.data?.message || response?.data?.Message);
      setFormData({
        ReportDate: "",
        Name: "",
        ContactDetails: "",
        Email: "",
        TourDate: "",
        MoreAboutTrip: "",
        howdoyoulikeabouttrip: "",
        ImproveofTrips: "",
        RecomndationTrip: "",
        TravlewithNearFuture: "",
        ReceiveOfferAlerts: "",
        Comments: "",
        Rate: "",
        Services: [],
      });
      setDestinationsWithServices([]);
      navigate("/query/tour-execution");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // alert("Failed to submit feedback.");
    }
  };

  const handleDownload = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 0,
      filename: "feedback-form.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  // Styles (unchanged)
  const labelStyle = {
    fontWeight: "bold",
    display: "inline-block",
    fontSize: "12px",
    marginRight: "10px",
    minWidth: "100px",
  };

  const inputStyle = {
    border: "none",
    borderBottom: "1px solid black",
    backgroundColor: "transparent",
    padding: "0px 4px",
    width: "200px",
    outline: "none",
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
    paddingTop: "10px",
    marginBottom: "20px",
    fontSize: "14px",
  };

  const colStyle = {
    width: "48%",
    display: "flex",
    alignItems: "center",
  };

  const smallLabelStyle = {
    fontWeight: "bold",
    marginRight: "14px",
    minWidth: "200px",
  };

  const checkboxGroupStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const spanStyle = {
    whiteSpace: "nowrap",
    marginRight: "14px",
  };

  const textareaStyle = {
    border: "1px solid #000",
    backgroundColor: "transparent",
    width: "100%",
    height: "60px",
    padding: "4px",
    resize: "vertical",
  };
  useEffect(() => {
    const today = new Date();
    const formatted = today.toISOString().split("T")[0]; // YYYY-MM-DD
    setFormData((prev) => ({ ...prev, ReportDate: formatted }));
  }, []);

  return (
    <Container fluid className="">
      <div className="row pb-2">
        <div className="col-12 d-flex gap-3 justify-content-end w-100">
          <button className="btn btn-primary btn-custom-size" onClick={handleDownload}>
            Download PDF
          </button>
          <button className="btn btn-primary btn-custom-size" onClick={handleSubmit}>
            {rowData?.id ? "Update" : "Submit"}
          </button>
          <button
            className="btn btn-dark btn-custom-size"
            name="SaveButton"
            onClick={() => navigate("/query/tour-execution")}
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
          // src={logo}
          // src={`${import.meta.env.VITE_LOGIN_URI_IMAGE}${companylogo?.Value?.ImageName}`}
          src={`${import.meta.env.VITE_LOGIN_URI_IMAGE}${companylogo?.Value?.ImageName}`}
          style={{ display: "block", marginLeft: "auto" }}
          alt="img"
        />
        <p
          className="text-center fw-bold fs-4 mb-4 border-bottom mx-auto"
          style={{ maxWidth: "max-content" }}
        >
          Feedback Form
        </p>

        <div className="d-flex justify-content-end mb-5">
          <div>
            <label style={labelStyle}>Report Dated :</label>
            <input
              type="date"
              name="ReportDate"
              style={inputStyle}
              placeholder=""
              value={formData.ReportDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={halfWidth}>
            {/* <label style={labelStyle}>Tour Code :</label> */}
            <label style={labelStyle}>File Code :</label>
            <input
              type="text"
              name="TourCode"
              style={inputStyle}
              placeholder="Enter Tour Code"
              value={rowData?.TourId || queryQuotationData?.FileNo || ""}
              readOnly
            />
          </div>
          <div style={halfWidth}>
            <label style={labelStyle}>Name :</label>
            <input
              type="text"
              name="Name"
              style={inputStyle}
              placeholder="Enter Name"
              value={formData.Name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={halfWidth}>
            <label style={labelStyle}>Contact Details :</label>
            <input
              type="text"
              name="ContactDetails"
              style={inputStyle}
              placeholder="Enter Contact Details"
              value={formData.ContactDetails}
              onChange={handleChange}
            />
          </div>
          <div style={halfWidth}>
            <label style={labelStyle}>Email :</label>
            <input
              type="text"
              name="Email"
              style={inputStyle}
              placeholder="Enter Email"
              value={formData.Email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={halfWidth}>
            <label style={labelStyle}>Tour Date :</label>
            <input
              type="date"
              name="TourDate"
              style={inputStyle}
              placeholder="Enter Tour Date"
              value={formData.TourDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <p className="fw-bold fs-4 mb-0 border-bottom">Services</p>

        {destinationsWithServices.map((destination, index) => (
          <div key={index} style={sectionStyle}>
            <div
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                marginBottom: "10px",
              }}
            >
              {destination.DestinationName}
            </div>

            <div>
              {destination.Services.map((service, serviceIndex) => (
                service.ServiceName ? (
                  <div key={serviceIndex} style={rowStyle}>

                    <div style={colStyle}>
                      <span style={smallLabelStyle}>{service.ServiceName} :</span>
                      <div style={checkboxGroupStyle}>
                        <input
                          type="checkbox"
                          name={`Feedback_${index}_${serviceIndex}_Poor`}
                          checked={service.ServiceRate === "Poor"}
                          onChange={() =>
                            handleServiceFeedback(index, serviceIndex, "Poor")
                          }
                        />
                        <span style={spanStyle}>Poor</span>
                        <input
                          type="checkbox"
                          name={`Feedback_${index}_${serviceIndex}_Average`}
                          checked={service.ServiceRate === "Average"}
                          onChange={() =>
                            handleServiceFeedback(index, serviceIndex, "Average")
                          }
                        />
                        <span style={spanStyle}>Average</span>
                        <input
                          type="checkbox"
                          name={`Feedback_${index}_${serviceIndex}_Good`}
                          checked={service.ServiceRate === "Good"}
                          onChange={() =>
                            handleServiceFeedback(index, serviceIndex, "Good")
                          }
                        />
                        <span style={spanStyle}>Good</span>
                        <input
                          type="checkbox"
                          name={`Feedback_${index}_${serviceIndex}_VeryGood`}
                          checked={service.ServiceRate === "Very Good"}
                          onChange={() =>
                            handleServiceFeedback(index, serviceIndex, "Very Good")
                          }
                        />
                        <span style={spanStyle}>Very Good</span>
                        <input
                          type="checkbox"
                          name={`Feedback_${index}_${serviceIndex}_Excellent`}
                          checked={service.ServiceRate === "Excellent"}
                          onChange={() =>
                            handleServiceFeedback(index, serviceIndex, "Excellent")
                          }
                        />
                        <span style={spanStyle}>Excellent</span>
                      </div>
                    </div>

                  </div>) : (
                  <div className="d-none"></div>
                )
              ))}
            </div>
          </div>
        ))}

        <div style={sectionStyle}>
          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>
              What did you like most about the trip ?
            </label>
            <textarea
              style={textareaStyle}
              name="howdoyoulikeabouttrip"
              value={formData.howdoyoulikeabouttrip}
              onChange={handleChange}
            ></textarea>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>What did you not like about the trip ?</label>
            <textarea
              style={textareaStyle}
              name="MoreAboutTrip"
              value={formData.MoreAboutTrip}
              onChange={handleChange}
            ></textarea>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>
              What else we can do to improve our trips in future ?
            </label>
            <textarea
              style={textareaStyle}
              name="ImproveofTrips"
              value={formData.ImproveofTrips}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={rowStyle}>
            <div style={colStyle}>
              <span style={smallLabelStyle}>
                Would you recommend this trip to any of your friends ?
              </span>
              <div style={checkboxGroupStyle}>
                <input
                  type="checkbox"
                  name="RecomndationTrip"
                  checked={formData.RecomndationTrip === "Yes"}
                  onChange={() => handleRecommendation("RecomndationTrip", "Yes")}
                />
                <span>Yes</span>
                <input
                  type="checkbox"
                  name="RecomndationTrip"
                  checked={formData.RecomndationTrip === "No"}
                  onChange={() => handleRecommendation("RecomndationTrip", "No")}
                />
                <span>No</span>
              </div>
            </div>

            <div style={colStyle}>
              <span style={smallLabelStyle}>
                Would you like to travel with us in near future ?
              </span>
              <div style={checkboxGroupStyle}>
                <input
                  type="checkbox"
                  name="TravlewithNearFuture"
                  checked={formData.TravlewithNearFuture === "Yes"}
                  onChange={() =>
                    handleRecommendation("TravlewithNearFuture", "Yes")
                  }
                />
                <span>Yes</span>
                <input
                  type="checkbox"
                  name="TravlewithNearFuture"
                  checked={formData.TravlewithNearFuture === "No"}
                  onChange={() =>
                    handleRecommendation("TravlewithNearFuture", "No")
                  }
                />
                <span>No</span>
              </div>
            </div>
          </div>

          <div style={rowStyle}>
            <div style={colStyle}>
              <span style={smallLabelStyle}>
                Would you like to receive offer alerts in future ?
              </span>
              <div style={checkboxGroupStyle}>
                <input
                  type="checkbox"
                  name="ReceiveOfferAlerts"
                  checked={formData.ReceiveOfferAlerts === "Definitely Yes"}
                  onChange={() =>
                    handleRecommendation("ReceiveOfferAlerts", "Definitely Yes")
                  }
                />
                <span>Definitely Yes</span>
                <input
                  type="checkbox"
                  name="ReceiveOfferAlerts"
                  checked={formData.ReceiveOfferAlerts === "No Thanks"}
                  onChange={() =>
                    handleRecommendation("ReceiveOfferAlerts", "No Thanks")
                  }
                />
                <span>No Thanks</span>
              </div>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Additional Comments : (if any)</label>
            <textarea
              style={textareaStyle}
              name="Comments"
              value={formData.Comments}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={rowStyle}>
            <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
              <span style={smallLabelStyle}>Rate your Satisfaction :</span>
              <div style={checkboxGroupStyle}>
                <input
                  type="checkbox"
                  name="Rate"
                  checked={formData.Rate === "Fantastic"}
                  onChange={() => handleRecommendation("Rate", "Fantastic")}
                />
                <span>Fantastic</span>
                <input
                  type="checkbox"
                  name="Rate"
                  checked={formData.Rate === "Very Good - I had a great time out !"}
                  onChange={() =>
                    handleRecommendation("Rate", "Very Good - I had a great time out !")
                  }
                />
                <span>Very Good - I had a great time out !</span>
                <input
                  type="checkbox"
                  name="Rate"
                  checked={formData.Rate === "Good I enjoyed myself"}
                  onChange={() =>
                    handleRecommendation("Rate", "Good I enjoyed myself")
                  }
                />
                <span>Good I enjoyed myself</span>
                <input
                  type="checkbox"
                  name="Rate"
                  checked={formData.Rate === "Ok - Not really what I Expected"}
                  onChange={() =>
                    handleRecommendation("Rate", "Ok - Not really what I Expected")
                  }
                />
                <span>Ok - Not really what I Expected</span>
                <input
                  type="checkbox"
                  name="Rate"
                  checked={formData.Rate === "Disappointing"}
                  onChange={() => handleRecommendation("Rate", "Disappointing")}
                />
                <span>Disappointing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 d-flex gap-2 justify-content-end align-items-center">
        <button className="btn btn-primary btn-custom-size" onClick={handleDownload}>
          Download PDF
        </button>
        <button className="btn btn-primary btn-custom-size" onClick={handleSubmit}>
          {rowData?.id ? "Update" : "Submit"}
        </button>
      </div>
    </Container>
  );
};

export default FeedbackForm;