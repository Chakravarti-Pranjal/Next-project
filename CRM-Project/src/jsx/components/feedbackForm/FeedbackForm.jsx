import React, { useEffect, useRef, useState } from "react";
import { Container, Button } from "react-bootstrap";
import logo from "/invoice/deboxlogo.png"
import html2pdf from "html2pdf.js";

const FeedbackForm = () => {

    const pdfRef = useRef();

    const labelStyle = {
        fontWeight: 'bold',
        display: 'inline-block',
        fontSize: "12px",
        marginRight: "10px",
        minWidth: "100px"
    };

    const inputStyle = {
        border: 'none',
        borderBottom: '1px solid black',
        backgroundColor: 'transparent',
        padding: '0px 4px',
        width: '200px',
        outline: 'none',
    };
    const smallInputStyle = {
        ...inputStyle,
        width: '60px',
    };
    const smallLabel = {
        fontWeight: 'bold',
        minWidth: '50px',
        display: 'inline-block',
    };

    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
    };

    const halfWidth = {
        width: '48%',
    };

    const sectionStyle = {
        // borderTop: '2px solid black',
        paddingTop: '10px',
        marginBottom: '20px',
        fontSize: '14px',
    };

    const colStyle = {
        width: '48%',
        display: 'flex',
        alignItems: 'center',

    };
    const colStyle100 = {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    };


    const smallLabelStyle = {
        fontWeight: 'bold',
        marginRight: '8px',
        minWidth: '150px',
    };

    const checkboxGroupStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    };
    const textareaStyle = {
        border: '1px solid #000',
        backgroundColor: 'transparent',
        width: '100%',
        height: '60px',
        padding: '4px',
        resize: 'vertical',
    };

    const handleDownload = async () => {
        try {
            const payload = {
                ...formData,
                "Departure/ArrivelTime": formData?.ArrivelTime
            }
            delete payload.ArrivelTime;
            // Send data to your API
            const response = await axiosOther.post("addupdate-briffing-sheet", payload);
            // console.log(response, "res")
            if (response?.data?.Status === 201 || response?.data?.Status === 200) {
                // If data is successfully saved, generate the PDF
                notifySuccess(response?.data?.Message)
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
        } catch (error) {
            console.error("Error saving data or generating PDF:", error);
            alert("Something went wrong! Please try again.");
        }
    };



    return (

        <>
            <Container fluid className="p-4">
                <div className="row p-4">
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
                        padding: "20px"
                    }}
                >
                    <img width={100} src={logo} style={{ display: "block", marginLeft: "auto" }} alt="img" />
                    <p className="text-center fw-bold fs-4 mb-4 border-bottom mx-auto" style={{ maxWidth: "max-content" }}>Feedback Form</p>

                    <div style={rowStyle}>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Tour Code :</label>
                            <input type="text" name="Date" style={inputStyle} placeholder="Enter Tour Code" />
                        </div>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Name :</label>
                            <input type="text" name="FileCode" style={inputStyle} placeholder="Enter Name" />
                        </div>
                    </div>

                    <div style={rowStyle}>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Contact Details :</label>
                            <input type="text" name="Date" style={inputStyle} placeholder="Enter Contact Details" />
                        </div>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Email :</label>
                            <input type="text" name="FileCode" style={inputStyle} placeholder="Enter Email" />
                        </div>
                    </div>

                    <div style={rowStyle}>
                        <div style={halfWidth}>
                            <label style={labelStyle}>Tour Date :</label>
                            <input type="text" name="Date" style={inputStyle} placeholder="Enter Tour Date" />
                        </div>
                    </div>

                    <p className="fw-bold fs-4 mb-0 border-bottom">Services</p>

                    <div style={sectionStyle}>
                        <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px' }}>
                            Agra
                        </div>

                        <div style={rowStyle}>
                            <div style={colStyle}>
                                <span style={smallLabelStyle}>Coral Tree Home stay :</span>
                                <div style={checkboxGroupStyle}>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Poor</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Average</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Good</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Very Good</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Excellent</span>
                                </div>
                            </div>

                            <div style={colStyle}>
                                <span style={smallLabelStyle}>Escort / Guide :</span>
                                <div style={checkboxGroupStyle}>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Poor</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Average</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Good</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Very Good</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Excellent</span>
                                </div>
                            </div>
                        </div>


                        <div style={rowStyle}>
                            <div style={colStyle}>
                                <span style={smallLabelStyle}>Transport :</span>
                                <div style={checkboxGroupStyle}>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Poor</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Average</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Good</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Very Good</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Excellent</span>
                                </div>
                            </div>


                        </div>



                    </div>


                    <div style={sectionStyle}>
                        <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px' }}>
                            Delhi
                        </div>

                        <div style={rowStyle}>
                            <div style={colStyle}>
                                <span style={smallLabelStyle}>Radisson Blu Marina Hotel :</span>
                                <div style={checkboxGroupStyle}>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Poor</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Average</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Good</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Very Good</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Excellent</span>
                                </div>
                            </div>

                            <div style={colStyle}>
                                <span style={smallLabelStyle}>Escort / Guide :</span>
                                <div style={checkboxGroupStyle}>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Poor</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Average</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Good</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Very Good</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Excellent</span>
                                </div>
                            </div>
                        </div>


                        <div style={rowStyle}>
                            <div style={colStyle}>
                                <span style={smallLabelStyle}>Transport :</span>
                                <div style={checkboxGroupStyle}>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Poor</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Average</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Good</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Very Good</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Excellent</span>
                                </div>
                            </div>


                        </div>



                    </div>


                    <div style={sectionStyle}>


                        <div style={{ marginBottom: '12px' }}>
                            <label style={labelStyle}>What did you like most about the trip ?</label>
                            <textarea style={textareaStyle} name="sightseeingA" ></textarea>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label style={labelStyle}>What did you not like about the trip ?</label>
                            <textarea style={textareaStyle} name="sightseeingB" ></textarea>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label style={labelStyle}>What else we can do to improve our trips in future ?</label>
                            <textarea style={textareaStyle} name="sightseeingB" ></textarea>
                        </div>


                    </div>



                    <div style={sectionStyle}>


                        <div style={rowStyle}>
                            <div style={colStyle}>
                                <span style={smallLabelStyle}>Coral Tree Home stay :</span>
                                <div style={checkboxGroupStyle}>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Yes</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>No</span>

                                </div>
                            </div>

                            <div style={colStyle}>
                                <span style={smallLabelStyle}>Escort / Guide :</span>
                                <div style={checkboxGroupStyle}>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Yes</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>No</span>

                                </div>
                            </div>
                        </div>


                        <div style={rowStyle}>
                            <div style={colStyle}>
                                <span style={smallLabelStyle}>Transport :</span>
                                <div style={checkboxGroupStyle}>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Definitely Yes</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>No Thanks</span>

                                </div>
                            </div>


                        </div>



                    </div>












                    <div style={sectionStyle}>


                        <div style={{ marginBottom: '12px' }}>
                            <label style={labelStyle}>Additional Comments : (if any)</label>
                            <textarea style={textareaStyle} name="sightseeingA" ></textarea>
                        </div>


                    </div>



                    <div style={sectionStyle}>

                        <div style={rowStyle}>
                            <div style={colStyle100}>
                                <span style={smallLabelStyle}>Rate your Satisfaction :</span>
                                <div style={checkboxGroupStyle}>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Fantastic</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span> Very Good - I had a great time out !</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Good I enjoyed myself</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Ok - Not really what I Expected</span>
                                    <input
                                        type="checkbox"
                                        name="Itinenary"

                                    />
                                    <span>Disappointing</span>
                                </div>
                            </div>
                        </div>



                    </div>




                </div>

                {/* Input form below (not printed) */}
                <div className="mt-4">

                    <Button className="btn btn-primary btn-sm" onClick={handleDownload}>
                        Download PDF
                    </Button>
                </div>
            </Container>


            <div className="card shadow-none mt-1">
                <div className="card-body p-0">
                    <div className="tab-content card-Custom-Padding" style={{ maxWidth: "794px", margin: "0 auto" }}>
                        <h5 className="text-end mb-4">
                            <strong>Report Dated :</strong>{" "}
                            <u>05-10-2019</u>
                        </h5>

                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="tourCode" className="form-label">
                                    <strong>Tour Code :</strong>
                                </label>
                            </div>
                            <div className="col-9">
                                <input
                                    type="text"
                                    className="form-control form-control-sm border border-bottom"
                                    id="tourCode"
                                    placeholder="Enter Tour Code"
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="name" className="form-label">
                                    <strong>Name :</strong>
                                </label>
                            </div>
                            <div className="col-9">
                                <input
                                    type="text"
                                    className="form-control form-control-sm border border-bottom"
                                    id="name"
                                    placeholder="Enter Name"
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="contact" className="form-label">
                                    <strong>Contact Details :</strong>
                                </label>
                            </div>
                            <div className="col-9">
                                <input
                                    type="text"
                                    className="form-control form-control-sm border border-bottom"
                                    id="contact"
                                    placeholder="Enter Contact Details"
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="email" className="form-label">
                                    <strong>Email :</strong>
                                </label>
                            </div>
                            <div className="col-9">
                                <input
                                    type="email"
                                    className="form-control form-control-sm border border-bottom"
                                    id="email"
                                    placeholder="Enter Email"
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="tourDate" className="form-label">
                                    <strong>Tour Date :</strong>
                                </label>
                            </div>
                            <div className="col-9">
                                <input
                                    type="text"
                                    className="form-control form-control-sm border border-bottom text-muted"
                                    id="tourDate"
                                    placeholder="DD-MM-YYYY - DD-MM-YYYY"
                                />
                            </div>
                        </div>


                        <div className="mt-4">
                            <h5 className="fw-bold border-bottom pb-1">Services</h5>

                            {/* Agra */}
                            <h6 className="fw-bold">Agra</h6>

                            {/* Coral Tree Home stay */}
                            <div className="row mb-2 align-items-center">
                                <div className="col-md-3"><label htmlFor="" className="form-label">
                                    <strong>Coral Tree Home stay</strong>
                                </label></div>
                                <div className="col-md-9">
                                    <div className="row">
                                        {["Poor", "Average", "Good", "Very Good", "Excellent"].map((label, i) => (
                                            <div className="col-md-2" key={`agra-1-${i}`}>
                                                <div className="form-check d-flex align-items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input height-em-1 width-em-1"
                                                        id={`agra-home-${i}`}
                                                        name="agra-home"
                                                    />
                                                    <label className="form-check-label ms-1 small" htmlFor={`agra-home-${i}`}>
                                                        {label}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Escort / Guide */}
                            <div className="row mb-2 align-items-center">
                                <div className="col-md-3"><label htmlFor="" className="form-label">
                                    <strong>Escort / Guide</strong>
                                </label></div>
                                <div className="col-md-9">
                                    <div className="row">
                                        {["Poor", "Average", "Good", "Very Good", "Excellent"].map((label, i) => (
                                            <div className="col-md-2" key={`agra-2-${i}`}>
                                                <div className="form-check d-flex align-items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input height-em-1 width-em-1"
                                                        id={`agra-guide-${i}`}
                                                        name="agra-guide"
                                                    />
                                                    <label className="form-check-label ms-1 small" htmlFor={`agra-guide-${i}`}>
                                                        {label}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Transport */}
                            <div className="row mb-2 align-items-center">
                                <div className="col-md-3"><label htmlFor="" className="form-label">
                                    <strong>Transport</strong>
                                </label></div>
                                <div className="col-md-9">
                                    <div className="row">
                                        {["Poor", "Average", "Good", "Very Good", "Excellent"].map((label, i) => (
                                            <div className="col-md-2" key={`agra-3-${i}`}>
                                                <div className="form-check d-flex align-items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input height-em-1 width-em-1"
                                                        id={`agra-transport-${i}`}
                                                        name="agra-transport"
                                                    />
                                                    <label className="form-check-label ms-1 small" htmlFor={`agra-transport-${i}`}>
                                                        {label}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Delhi */}
                            <h6 className="fw-bold mt-3">Delhi</h6>

                            {/* Radisson Blu Marina Hotel */}
                            <div className="row mb-2 align-items-center">
                                <div className="col-md-3"><label htmlFor="" className="form-label">
                                    <strong>Radisson Blu Marina Hotel</strong>
                                </label></div>
                                <div className="col-md-9">
                                    <div className="row">
                                        {["Poor", "Average", "Good", "Very Good", "Excellent"].map((label, i) => (
                                            <div className="col-md-2" key={`delhi-1-${i}`}>
                                                <div className="form-check d-flex align-items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input height-em-1 width-em-1"
                                                        id={`delhi-hotel-${i}`}
                                                        name="delhi-hotel"
                                                    />
                                                    <label className="form-check-label ms-1 small" htmlFor={`delhi-hotel-${i}`}>
                                                        {label}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Escort / Guide */}
                            <div className="row mb-2 align-items-center">
                                <div className="col-md-3"><label htmlFor="" className="form-label">
                                    <strong>Escort / Guide</strong>
                                </label></div>
                                <div className="col-md-9">
                                    <div className="row">
                                        {["Poor", "Average", "Good", "Very Good", "Excellent"].map((label, i) => (
                                            <div className="col-md-2" key={`delhi-2-${i}`}>
                                                <div className="form-check d-flex align-items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input height-em-1 width-em-1"
                                                        id={`delhi-guide-${i}`}
                                                        name="delhi-guide"
                                                    />
                                                    <label className="form-check-label ms-1 small" htmlFor={`delhi-guide-${i}`}>
                                                        {label}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Transport */}
                            <div className="row mb-2 align-items-center">
                                <div className="col-md-3"><label htmlFor="" className="form-label">
                                    <strong>Transport</strong>
                                </label></div>
                                <div className="col-md-9">
                                    <div className="row">
                                        {["Poor", "Average", "Good", "Very Good", "Excellent"].map((label, i) => (
                                            <div className="col-md-2" key={`delhi-3-${i}`}>
                                                <div className="form-check d-flex align-items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input height-em-1 width-em-1"
                                                        id={`delhi-transport-${i}`}
                                                        name="delhi-transport"
                                                    />
                                                    <label className="form-check-label ms-1 small" htmlFor={`delhi-transport-${i}`}>
                                                        {label}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="mt-4">

                            <div className="mb-4">
                                <label className="form-label">
                                    What did you like most about the trip ?
                                </label>
                                <textarea
                                    className="form-control border"
                                    rows="4"
                                    style={{ resize: "none" }}
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">
                                    What did you not like about the trip ?
                                </label>
                                <textarea
                                    className="form-control border"
                                    rows="4"
                                    style={{ resize: "none" }}
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">
                                    What else we can do to improve our trips in future ?
                                </label>
                                <textarea
                                    className="form-control border"
                                    rows="4"
                                    style={{ resize: "none" }}
                                ></textarea>
                            </div>

                        </div>


                        <div className="mt-4">

                            {/* Yes/No Section */}
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Would you recommend this trip to any of your friends ?</label>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-check form-check-inline">
                                        <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                                        <label className="form-check-label">Yes</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                                        <label className="form-check-label">No</label>
                                    </div>
                                </div>

                                <div className="col-md-6 mt-2">
                                    <label className="form-label">Would you like to travel with us in near future ?</label>
                                </div>
                                <div className="col-md-6 mt-2">
                                    <div className="form-check form-check-inline">
                                        <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                                        <label className="form-check-label">Yes</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                                        <label className="form-check-label">No</label>
                                    </div>
                                </div>

                                <div className="col-md-6 mt-2">
                                    <label className="form-label">Would you like to receive offer alerts in future ?</label>
                                </div>
                                <div className="col-md-6 mt-2">
                                    <div className="form-check form-check-inline">
                                        <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                                        <label className="form-check-label">Definitely Yes</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                                        <label className="form-check-label">No Thanks</label>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Comments */}
                            <div className="mb-4">
                                <label className="form-label">
                                    Additional Comments : (if any)
                                </label>
                                <textarea
                                    className="form-control border"
                                    rows="4"
                                    style={{ resize: "none" }}
                                ></textarea>
                            </div>

                            {/* Rate your Satisfaction */}
                            <div className="mb-3">

                                <div className="row">
                                    <div className="col-md-4">
                                        <label className="form-label">
                                            Rate your Satisfaction :
                                        </label>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                                            <label className="form-check-label">Fantastic</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                                            <label className="form-check-label">Good I enjoyed myself</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                                            <label className="form-check-label">Disappointing</label>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                                            <label className="form-check-label">Very Good - I had a great time out !</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                                            <label className="form-check-label">Ok - Not really what I Expected</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default FeedbackForm;
