import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Row,
  Card,
  Col,
  Button,
  Nav,
  Container,
  Dropdown,
} from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Office from "../../../layouts/common/office";
import ContactPerson from "../../../layouts/common/contactPerson";
import CompanyDocument from "../../../layouts/common/companyDocument";
import BankDetail from "../../../layouts/common/bankDetail";
import Task from "../../../layouts/common/task";
import Call from "../../../layouts/common/call";
import Meetings from "../../../layouts/common/meetings";
const ViewClient = () => {
  const param = useParams();
  const [id, setId] = useState();

  const [countrylist, setCountrylist] = useState([]);
  const [divisionlist, setDivisionlist] = useState([]);
  const [clientlist, setClientlist] = useState([]);
  const [statelist, setStatelist] = useState([]);
  const [citylist, setCitylist] = useState([]);
  const navigate = useNavigate()

  // console.log(clientlist,"clientlist")

  const getDataToServer = async () => {
    try {
      const response = await axiosOther.post("countrylist", {
        Search: "",
        Status: 1,
      });
      setCountrylist(response.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const response = await axiosOther.post("divisionlist", {
        Search: "",
        Status: 1,
      });
      setDivisionlist(response.data.DataList);
    } catch (err) {
      console.log(err);
    }

    try {
      const response = await axiosOther.post("directClientlist", {
        BusinessType: 1,
        id: param?.id,
      });
      setClientlist(response.data.DataList?.[0]);
    } catch (err) {
      console.log(err);
    }
    try {
      const response = await axiosOther.post("statelist", {
        Search: "",
        Status: 1,
      });
      setStatelist(response.data.DataList);
    } catch (err) {
      console.log(err);
    }
    try {
      const response = await axiosOther.post("citylist", {
        Search: "",
        Status: 1,
      });
      setCitylist(response.data.DataList);
    } catch (err) {
      console.log(err);
    }
  };
  // console.log(clientlist,"client")
  const svg1 = (
    <svg width="20px" height="20px" viewBox="0 0 24 24" version="1.1">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect x="0" y="0" width="24" height="24"></rect>
        <circle fill="#000000" cx="5" cy="12" r="2"></circle>
        <circle fill="#000000" cx="12" cy="12" r="2"></circle>
        <circle fill="#000000" cx="19" cy="12" r="2"></circle>
      </g>
    </svg>
  );
  useEffect(() => {
    getDataToServer();
    setId(param?.id);
  }, []);
  return (
    <>
      <Row>
        <Col lg={12} className="p-0">
          <Card>
            <Card.Header className="py-3">
              <Card.Title>
                Contact Information</Card.Title>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-dark btn-custom-size"
                  name="SaveButton"
                  onClick={() => navigate(-1)}
                >
                  <span className="me-1">Back</span>
                  <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                </button>
              </div>
            </Card.Header>
          </Card>
        </Col>
        <Col
          lg={12}
          className="table card-table display mb-4 shadow-hover default-table dataTablesCard dataTable no-footer mt-2"
          id="example2"
        >

          <Row>
            <Col sm={2}>
              <Col sm={6}>
                <div>
                  <label className="text-white">Full Name: </label>
                  <p>{clientlist?.FirstName} {clientlist?.MiddleName} {clientlist?.LastName}  </p>
                </div>
              </Col>
              <Col sm={6}>
                <div>
                  <label className="text-white">Date Of Birth:</label>
                  <p>{clientlist?.DOB}</p>
                </div>
              </Col>
              <Col sm={6}>
                <div>
                  <label className="text-white">Anniversay Date: </label>
                  <p>{clientlist?.AnniversaryDate} </p>
                </div>
              </Col>
              <Col sm={6}>
                <div>
                  <label className="text-white">Country</label>

                  <p>{clientlist?.Country?.Name}</p>


                </div>
              </Col>
              <Col sm={6}>
                <div>
                  <label className="text-white">State </label>

                  <p>{clientlist?.State?.Name}</p>


                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Mobile</label>
                  <p>
                    {clientlist?.Contactinfo?.map((info, index) => (
                      <p key={index}>{info.Mobile}{index !== clientlist.Contactinfo.length - 1 ? ", " : ""}</p>
                    ))}
                  </p>
                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Email</label>
                  <p>{clientlist?.Contactinfo?.map((info, index) => (
                    <p key={index}>{info.Email}{index !== clientlist.Contactinfo.length - 1 ? ", " : ""}</p>
                  ))}</p>
                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Emergency Contact:</label>{" "}
                  <p>
                    {clientlist?.EmergencyContactNumber}
                  </p>
                </div>
              </Col>





            </Col>
            <Col sm={2}>


              {/* <Col sm={12}>
                <div>
                  <label className="text-white">Country</label>
                  <p> {clientlist?.Country?.Name}</p>

                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">State</label>
                  <p>{clientlist?.State?.Name}</p>

                </div>
              </Col> */}
              <Col sm={12}>
                <div>
                  <label className="text-white">City</label>
                  <p>{clientlist?.City?.Name}</p>

                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Address</label>
                  <p>{clientlist?.Address}</p>

                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Remark 1</label>
                  <p>{clientlist?.Remark1}</p>

                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Remark 2</label>
                  <p>{clientlist?.Remark2}</p>

                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Remark 3</label>
                  <p>{clientlist?.Remark3}</p>

                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Family Code</label>
                  <p>{clientlist?.FamilyCode || "N/A"}</p>
                </div>
              </Col>

              <Col sm={12}>
                <div>
                  <label className="text-white">Covid Vaccinated</label>
                  <p>{clientlist?.CovidVaccinated || "N/A"}</p>
                </div>
              </Col>

              <Col sm={12}>
                <div>
                  <label className="text-white">Document Title</label>
                  <p>{clientlist?.Documentation?.[0]?.DocumentTitle || "N/A"}</p>
                </div>
              </Col>










            </Col>
            <Col sm={2}>

              <Col sm={12}>
                <div>
                  <label className="text-white">Nationality:</label>
                  <p>{clientlist?.Nationality?.Name}</p>
                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white"> Tour Type: </label>
                  <p> {clientlist?.TourType}</p>
                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Meal Preference: </label>

                  <p>{clientlist?.MealPreference}</p>


                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Holiday Preference:</label>
                  <p>{clientlist?.NationalityName}</p>
                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Special Assistance:</label>{" "}
                  <p>
                    {clientlist?.SpecialAssistence}
                  </p>
                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Seat Preference</label>
                  <p>{clientlist?.SeatPreference}</p>

                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white"> Market Type: </label>
                  <p>{clientlist?.MarketType?.Name}</p>
                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Nationality:</label>
                  <p>{clientlist?.Nationality?.Name}</p>
                </div>
              </Col>
            </Col>

            <Col sm={2}>
              <Col sm={12}>
                <div>
                  <label className="text-white">Expiry Date</label>
                  <p>{clientlist?.Documentation?.[0]?.ExpiryDate || "N/A"}</p>
                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white"> Market Type: </label>
                  <p>{clientlist?.MarketType?.Name}</p>
                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Relation</label>
                  <p>{clientlist?.Relation || "N/A"}</p>
                </div>
              </Col>

              <Col sm={6}>
                <div>
                  <label className="text-white">Emergency Contact Number</label>
                  <p>{clientlist?.EmergencyContactNumber || "N/A"}</p>
                </div>
              </Col>

              <Col sm={6}>
                <div>
                  <label className="text-white">Query ID</label>
                  <p>{clientlist?.QueryId || "N/A"}</p>
                </div>
              </Col>

              <Col sm={6}>
                <div>
                  <label className="text-white">Tour ID</label>
                  <p>{clientlist?.TourId || "N/A"}</p>
                </div>
              </Col>

              <Col sm={6}>
                <div>
                  <label className="text-white">Reference ID</label>
                  <p>{clientlist?.ReferenceId || "N/A"}</p>
                </div>
              </Col>

            </Col>
            <Col sm={2}>
              <Col sm={12}>
                <div>
                  <label className="text-white">Facebook</label>
                  <p>{clientlist?.Facebook}</p>

                </div>
              </Col>
              <Col md={6}>

                <div>
                  <label className="text-white">Twitter:</label>
                  <p>{clientlist?.Twitter}</p>
                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Linkedin</label>
                  <p> {clientlist?.LinkedIn}</p>

                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Document Type</label>
                  <p>{clientlist?.Documentation?.[0]?.DocumentType?.Name || "N/A"}</p>
                </div>
              </Col>

              <Col sm={12}>
                <div>
                  <label className="text-white">Document No</label>
                  <p>{clientlist?.Documentation?.[0]?.DocumentNo || "N/A"}</p>
                </div>
              </Col>

              <Col sm={12}>
                <div>
                  <label className="text-white">Issue Date</label>
                  <p>{clientlist?.Documentation?.[0]?.IssueDate || "N/A"}</p>
                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Meal Preference: </label>

                  <p>{clientlist?.MealPreference}</p>


                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Holiday Preference:</label>
                  <p>{clientlist?.NationalityName}</p>
                </div>
              </Col>

            </Col>
            <Col sm={2}>
              <Col sm={12}>
                <div>
                  <label className="text-white"> Tour Type: </label>
                  <p>{clientlist?.TourType}</p>
                </div>
              </Col>

              <Col sm={12}>
                <div>
                  <label className="text-white">Special Assistance:</label>{" "}
                  <p>
                    {clientlist?.SpecialAssistence}
                  </p>
                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Agent</label>
                  <p>{clientlist?.Agent || "N/A"}</p>
                </div>
              </Col>
              <Col sm={12}>
                <div>
                  <label className="text-white">Issue Country</label>
                  <p>{clientlist?.Documentation?.[0]?.IssueCountry?.Name || "N/A"}</p>
                </div>
              </Col>

              <Col sm={12}>
                <div>
                  <label className="text-white">Newsletter</label>
                  <p>{clientlist?.NewsLetter || "N/A"}</p>
                </div>
              </Col>

              <Col sm={12}>
                <div>
                  <label className="text-white">Emergency Contact Name</label>
                  <p>{clientlist?.EmergencyContactName || "N/A"}</p>
                </div>
              </Col>

            </Col>

          </Row>

        </Col>

        <Col lg={12}>
          <CompanyDocument
            partner_payload={{ Fk_partnerid: param?.id, Type: "client" }}
          />
        </Col>


        {/* <Col lg={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title className='d-flex justify-content-between'>
                           Contact Person
                            
                            </Card.Title>
                            <button className="btn btn-primary">
                                Add Contact Person
                            </button>
                        </Card.Header>
                        <Card.Body>

                            <Table responsive striped bordered >
                                <thead >
                                    <tr>

                                        <th scope="col">
                                            <strong>Sr</strong></th>
                                        <th scope="col"><strong>DIVISION</strong></th>
                                        <th scope="col"><strong>CONTACT PERSON</strong></th>
                                        <th scope="col"><strong>DESIGNATION</strong></th>
                                        <th scope="col"><strong>COUNTRY CODE</strong></th>
                                        <th scope="col"><strong>PHONE</strong></th>
                                        <th scope="col"><strong>STATUS</strong></th>
                                        <th scope="col"><strong>IMAGE 1</strong></th>
                                        <th scope="col"><strong>IMAGE 2</strong></th>
                                        <th scope="col"><strong>IMAGE 3</strong></th>
                                        <th scope="col"><strong>Action</strong></th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {contactlist && contactlist?.length > 0 && contactlist.map((item) => (
                                        <tr key={item?.id}>
                                            <td>
                                                <strong>{item?.id}</strong>
                                            </td>
                                            <td>{item?.Division}</td>
                                            <td>{item?.FirstName}</td>
                                            <td>{item?.Designation}</td>
                                            <td>{item?.CountryCode}</td>
                                            <td>{item?.Phone}</td>
                                            <td>{item?.Status}</td>

                                            <td>
                                                {item?.ImageNameOne}
                                            </td>
                                            <td>
                                                {item?.ImageNameOne}
                                            </td>
                                            <td>
                                                {item?.ImageNameOne}
                                            </td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        variant="danger"
                                                        className="light sharp i-false"
                                                    >
                                                        {svg1}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item>Edit</Dropdown.Item>
                                                        <Dropdown.Item>Delete</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>



                </Col>
           */}
      </Row>
    </>
  );
};
export default ViewClient;
