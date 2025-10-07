import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Card, Accordion } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useSelector } from "react-redux";
import { axiosOther } from "../../../http/axios_base_url";
import useQueryData from "../../../hooks/custom_hooks/useQueryData";
import { notifySuccess } from "../../../helper/notify";

const SupplierCommunication = ({ hotelData }) => {
  const serviceData = useSelector(
    (state) => state.activeTabOperationReducer.serviceData
  );
  console.log(serviceData, "RR6");

  const [emails, setEmails] = useState([]);
  const [mailTypeList, setMailTypeList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [formValue, setFormValue] = useState({});
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const selector = useSelector((state) => state.supplierReducer);
  const queryData = useQueryData();
  const defaultAccordion = [
    {
      title:
        "Dear Sir,Greetings from DeBox services! Thanks for the writing to us.We are working an...",
      text: "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.",
      bg: "primary",
    },
  ];
  // email-keys
  const getServerApi = async () => {
    try {
      const { data } = await axiosOther.post("email-keys");
      console.log(data, "data");
      setMailTypeList(data);
      if (data?.success) {
        console.log(data, "data");
      }
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { data } = await axiosOther.post("supplier-mail-list");

      setSupplierList(data);
      if (data?.success) {
        console.log(data, "data");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getServerApi();
  }, []);
  const handleBody = (data) => {
    setFormValue({
      ...formValue,
      Body: data,
    });
  };
  const handleFormChange = (e) => {
    const { value, name, type } = e.target;
    console.log(value, name, type);
    if (type == "file") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const base64String = base64.split(",")[1];
        setFormValue({
          ...formValue,
          Attachments: base64String,
        });
        console.log(formValue);
      };
      reader.readAsDataURL(file);
    } else {
      setFormValue({
        ...formValue,
        [name]: value,
      });
    }
  };
  const getBodyData = () => {};
  const handleSubmit = async () => {
    try {
      const { data } = await axiosOther.post("email-send", {
        ...formValue,
        Subject: `[${hotelData?.HotelDetails?.HotelId}] @ ${hotelData?.QueryId} Check Hotel availability ${hotelData?.HotelDetails?.HotelName}`,
      });

      if (data?.message == "Email sent successfully") {
        notifySuccess("Email sent successfully");
        // console.log(data, "data");
        // setFormValue([])
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle key press (Enter or comma)
  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim() !== "") {
      e.preventDefault();
      addEmail(inputValue.trim());
    }
  };

  // Function to add email
  const addEmail = (email) => {
    if (validateEmail(email) && !emails.includes(email)) {
      setEmails([...emails, email]);
    }
    setInputValue("");
  };
  const removeEmail = (index) => {
    const updatedEmails = emails.filter((_, i) => i !== index);
    setEmails(updatedEmails);
  };

  // Email validation function
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  return (
    <>
      <div className="row client-communication">
        <Col xl="12">
          {/* {showReply && 
              <MailReply/>
            } */}

          <Card className="transparent-card">
            <Card.Header
              className="d-flex justify-content-between text-primary"
              style={{ background: "#e234281a" }}
            >
              <Card.Title>
                Query Confirmed
                <div className="fs-12">
                  <p className="fw-600">
                    End Date :{" "}
                    <span className="fw-500">
                      {hotelData?.ItenaryDetails?.FromDate}
                    </span>
                  </p>
                </div>
              </Card.Title>
              {/* <button type="submit" className="btn btn-primary btn-custom-size" onClick={handleReply}>
              Reply</button> */}
            </Card.Header>
            <Card.Body px={1}>
              {hotelData !== null ? (
                <div className="row m-1">
                  <div className="col-12  itinerary-head-bg mt-1 p-1">
                    <span className="font-w600 fs-6">Subject :</span> [SUP
                    {hotelData?.HotelDetails?.HotelId}] @ {hotelData?.QueryId}{" "}
                    Check Hotel availability{" "}
                    {hotelData?.HotelDetails?.HotelName}
                  </div>
                  <div className="col-12">
                    <div className="row">
                      <div className="col-md-5">
                        <label className="" htmlFor="status">
                          Name
                        </label>

                        <select
                          name="Name"
                          id="status"
                          className="form-control form-control-sm"
                          value={hotelData?.HotelDetails?.HotelName}
                          // onChange={(e) => handleStateData(e)}
                        >
                          <option value="1">Select</option>
                          <option value={hotelData?.HotelDetails?.HotelName}>
                            {hotelData?.HotelDetails?.HotelName}
                          </option>
                        </select>
                      </div>
                      <div className="col-md-5">
                        <label className="" htmlFor="status">
                          Supplier
                        </label>

                        <input
                          type="email"
                          className="form-control form-control-sm"
                          placeholder="Email"
                          name="To"
                          value={formValue?.To}
                          onChange={handleFormChange}
                        />
                      </div>
                      {/* <div className='col-md-5'>
                <label className="" htmlFor="status">
                CC
                          </label>

                          <input
                  type="email"
                  className="form-control form-control-sm"
                  placeholder="Email"
                  // onChange={(e) => setFiterInput(e.target.value)}
                />
                </div> */}
                      <div className="col-lg-5">
                        <label htmlFor="status">CC</label>

                        {/* Email input wrapper with badges inside */}
                        <div
                          className="input-wrapper form-control form-control-sm"
                          onClick={() => inputRef.current.focus()}
                        >
                          {emails.map((email, index) => (
                            <span key={index} className="badge rounded-pill">
                              {email}
                              <button
                                className="remove-btn"
                                onClick={() => removeEmail(index)}
                              >
                                ×
                              </button>
                            </span>
                          ))}

                          {/* Actual input field */}
                          <input
                            ref={inputRef}
                            type="email"
                            className="input-field "
                            placeholder={
                              emails.length ? "" : "Enter email and press Enter"
                            }
                            value={inputValue}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                          />
                        </div>

                        {/* Show validation error */}
                        {inputValue && !validateEmail(inputValue) && (
                          <small className="text-danger">
                            Invalid email format
                          </small>
                        )}

                        {/* CSS Styling */}
                        <style>
                          {`
          .input-wrapper {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            {/* border: 1px solid #ccc; */}
            border-radius: 5px;
            padding: 5px;
            min-height: 40px;
            width: 100%;
            position: relative;
            
          }

          .badge {
            display: flex;
            align-items: center;
            background-color: #007bff;
            color: white;
            padding: 2px 2px;
            
            font-size: 0.75rem;
            white-space: nowrap;
            margin-right: 5px;
          }

          .remove-btn {
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            margin-left: 8px;
            cursor: pointer;
          }

          .remove-btn:hover {
            color: red;
          }

          .input-field {
            border: none;
            outline: none;
            font-size: 0.8rem;
            flex-grow: 1;
            min-width: 100px;
            background-color: #2e2e40;
    border-color: #3d3d3d;
    color: #fff;
        height: 1.8rem;
    border-radius: 0.5rem;
    padding: 0.3125rem 1.25rem;
          }

          .input-wrapper:focus-within {
            {/* border-color: #007bff; */}
            {/* box-shadow: 0 0 3px rgba(0, 123, 255, 0.5); */}
            
          }
        `}
                        </style>
                      </div>
                      <div className="row">
                        <div className="col-md-6 col-lg-5">
                          <label className="" htmlFor="val-username">
                            Attachment
                          </label>
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            id="val-username"
                            name="Attachments"
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="col-md-6 col-lg-5">
                          <label className="" htmlFor="val-username">
                            Mail Type
                          </label>
                          <select
                            name="MailType"
                            id="status"
                            className="form-control form-control-sm"
                            value={formValue?.MailType}
                            onChange={handleFormChange}
                          >
                            <option value="">Select</option>
                            {mailTypeList?.length > 0 &&
                              mailTypeList?.map((mail, index) => {
                                return (
                                  <option value={mail?.id}>
                                    {mail?.email_key}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="" htmlFor="status">
                          Add More Emails
                        </label>

                        <textarea
                          style={{ minHeight: "1.8rem" }}
                          className="form-control custom-textarea"

                          // placeholder="Search.."
                          // onChange={(e) => setFiterInput(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="fw-weight600">
                          Hotel Name - {hotelData?.HotelDetails?.HotelName}
                        </label>

                        <CKEditor
                          editor={ClassicEditor}
                          value={formValue?.Body || ""}
                          name="Body"
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            handleBody(data);
                          }}
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mt-2">
                      <button
                        type="submit"
                        className="btn btn-primary btn-custom-size"
                        onClick={handleSubmit}
                      >
                        Send Mail
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="m-0">Ansar</p>
                    <i class="fa-solid fa-circle-xmark text-primary fs-4 cursor-pointer"></i>
                  </div>

                  <Accordion
                    className="accordion accordion-header-shadow accordion-rounded"
                    defaultActiveKey="1"
                  >
                    {supplierList?.length > 0 &&
                      supplierList.map((d, i) => (
                        <Accordion.Item
                          className="accordion-item"
                          key={i}
                          eventKey={i.toString()}
                        >
                          <Accordion.Header className="accordion-header accordion-header--primary  d-flex  gap-2 justify-content-start font-size10">
                            <span className="accordion-header-icon m-1">
                              <i class="fa-solid fa-reply text-primary"></i>
                            </span>
                            <span className="accordion-header-text  font-size10">
                              {d?.subject}
                            </span>
                            <span className="accordion-header-text fs-12">
                              <i
                                class="fa-solid fa-circle mx-1 text-secondary "
                                style={{ fontSize: "0.5rem" }}
                              ></i>
                              {moment(d?.updated_at).format(
                                "h:mm a - DD-MM-YYYY"
                              )}
                            </span>
                            {/* <span className="accordion-header-indicator"></span> */}
                          </Accordion.Header>
                          <Accordion.Collapse
                            eventKey={i.toString()}
                            className="accordion__body p-1"
                          >
                            <div className="accordion-body px-1">
                              <div className="container-fluid m-0 p-1">
                                <div className="row">
                                  <div className="col-lg-3 col-md-6 col-sm-6 ">
                                    <div className="card email-column p-2 innerCard">
                                      <label
                                        className="font-w500 py-1"
                                        style={{ background: "#efefef" }}
                                      >
                                        {" "}
                                        <i class="fa-solid fa-envelope text-primary"></i>{" "}
                                        CLIENT:
                                      </label>
                                      <p className="m-0 font-size10">
                                        {" "}
                                        {d?.sender_email}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-lg-3 col-md-6 col-sm-6 ">
                                    <div className="card email-column p-2 innerCard">
                                      <label
                                        className="font-w500 py-1"
                                        style={{ background: "#efefef" }}
                                      >
                                        {" "}
                                        <i class="fa-solid fa-envelope text-primary"></i>{" "}
                                        OPERATION PERSON:
                                      </label>
                                      <p className="m-0 font-size10">
                                        {" "}
                                        {d?.receiver_email}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-lg-3 col-md-6 col-sm-6 ">
                                    <div className="card email-column p-2 innerCard">
                                      <label
                                        className="font-w500 py-1"
                                        style={{ background: "#efefef" }}
                                      >
                                        {" "}
                                        <i class="fa-solid fa-envelope text-primary"></i>{" "}
                                        SALES PERSON:
                                      </label>
                                      <p className="m-0 font-size10">
                                        {" "}
                                        nitin.kumboj@gmail.com
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-lg-3 col-md-6 col-sm-6">
                                    <div className="card email-column p-2 innerCard">
                                      <label
                                        className="font-w500 py-1"
                                        style={{ background: "#efefef" }}
                                      >
                                        {" "}
                                        <i class="fa-solid fa-envelope text-primary"></i>{" "}
                                        GROUP:
                                      </label>
                                      <p className="m-0 font-size10"> </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-12">
                                    <p
                                      className="font-size10"
                                      dangerouslySetInnerHTML={{
                                        __html: d?.body,
                                      }}
                                    >
                                      {/* Dear Sir,
                                <br>
                                </br>
                                Greetings from DeBox services!
                                <br></br>
                                Thanks for the writing to us.
                                <br></br>
                                We are working on your request and will provide you details shortly, till then kindly bear with us. */}
                                      {/* {d?.body}
                                {getBodyData()} */}
                                    </p>
                                  </div>
                                  <div className="col-12">
                                    <div className="p-0 border-1 border-grey">
                                      <p className="bg-grey px-2 font-w500 font-size-12">
                                        Query Id #DB24-25/002341
                                      </p>
                                      <Table responsive striped bordered>
                                        <thead>
                                          <tr>
                                            <th
                                              scope="col"
                                              className="font-size-12 "
                                            >
                                              <strong>
                                                Query Generated Date
                                              </strong>
                                            </th>
                                            <th
                                              scope="col"
                                              className="font-size-12 "
                                            >
                                              <strong>Subject</strong>
                                            </th>
                                            <th
                                              scope="col"
                                              className="font-size-12"
                                            >
                                              <strong>Adult</strong>
                                            </th>
                                            <th
                                              scope="col"
                                              className="font-size-12"
                                            >
                                              <strong>Child</strong>
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td>
                                              {moment(d?.updated_at).format(
                                                "DD/MM/YYYY"
                                              )}
                                            </td>
                                            <td>{d?.subject}</td>
                                          </tr>
                                        </tbody>
                                      </Table>
                                      <p className="bg-grey px-2 font-w500 font-size-12">
                                        Destinations
                                      </p>
                                      <Table responsive striped bordered>
                                        <thead>
                                          <tr>
                                            <th
                                              scope="col"
                                              className="font-size-12 "
                                            >
                                              <strong>S.N.</strong>
                                            </th>
                                            <th
                                              scope="col"
                                              className="font-size-12 "
                                            >
                                              <strong>Date</strong>
                                            </th>
                                            <th
                                              scope="col"
                                              className="font-size-12"
                                            >
                                              <strong>Destination</strong>
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody></tbody>
                                      </Table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Accordion.Collapse>
                        </Accordion.Item>
                      ))}
                  </Accordion>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </div>
    </>
  );
};

export default SupplierCommunication;
