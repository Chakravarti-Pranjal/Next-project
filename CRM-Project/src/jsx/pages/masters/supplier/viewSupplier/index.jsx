import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Row, Card, Col, Button, Nav, Container, Dropdown, } from "react-bootstrap";
import { axiosOther } from "../../../../../http/axios_base_url";
import "../../../../../scss/main.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Office from '../../../../layouts/common/office';
import ContactPerson from '../../../../layouts/common/contactPerson';
import CompanyDocument from '../../../../layouts/common/companyDocument';
import BankDetail from '../../../../layouts/common/bankDetail';
const ViewSupplier = () => {
    const param = useParams();
    const [id, setId] = useState()

    const [countrylist, setCountrylist] = useState([]);
    const [divisionlist, setDivisionlist] = useState([]);
    const [supplierlist, setSupplierlist] = useState([]);
    const [statelist, setStatelist] = useState([]);
    const [citylist, setCitylist] = useState([]);

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
            const response = await axiosOther.post("supplierlist", {
                Name: "",
                id: param?.id,
            });
            setSupplierlist(response.data.DataList);
            console.log(response.data.DataList, "111")
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
    }
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
        getDataToServer()
        setId(param?.id)
    }, [])
    return (
        <>
            <Row>
                <Col lg={12}>
                    <Card>
                        <Card.Header className='py-3'>
                            <Card.Title>Company Information</Card.Title>
                            <div className="d-flex gap-3">
                                <Link to={"/add/supplier"} className="btn btn-dark btn-custom-size">
                                    Back
                                </Link>
                            </div>
                        </Card.Header>
                        <Col lg={12} className="table card-table display mb-4 shadow-hover default-table dataTablesCard dataTable no-footer mt-2" id="example2">

                            {supplierlist && supplierlist?.length > 0 && supplierlist.map((data, index) => (
                                <Row>
                                    <Col md={3}>
                                        <p>
                                            <h4>Supplier Name : </h4><span>{data?.Name}</span></p></Col>
                                    <Col md={3}>
                                        <p>
                                            <h4>Alias Name :</h4><span>{data?.AliasName}</span></p></Col>
                                    <Col md={6}>
                                        <p>
                                            <h4>Supplier Services : </h4>{data?.SupplierServiceName.map((item) => (
                                                <span>{item?.name},</span>
                                            ))}
                                        </p></Col>
                                    <Col md={3}>
                                        <p>
                                            <h4>Pan Information : </h4>{data?.PanInformation}</p> </Col>
                                    <Col md={3}>
                                        <p>
                                            <h4>
                                                Payment Term:
                                            </h4>{data?.PaymentTerm}</p></Col>
                                    <Col md={3}><p>
                                        <h4>
                                            Default Destination:
                                        </h4> {data?.DefaultDestination.map((item, index) => (
                                            <span>{item?.name},</span>
                                        ))}
                                    </p></Col>
                                    <Col md={3}> <p>
                                        <h4>Local Agent :</h4> {data?.LocalAgent}
                                    </p></Col>
                                </Row>

                            ))}

                        </Col>
                    </Card>

                </Col>
                {/* <Col lg={12} className="table card-table display mb-4 shadow-hover default-table dataTablesCard dataTable no-footer mt-2" id="example2">

                    {supplierlist && supplierlist?.length > 0 && supplierlist.map((data, index) => (
                        <Row>
                            <Col md={3}>
                                <p>
                                    <h4>Supplier Name : </h4><span>{data?.Name}</span></p></Col>
                            <Col md={3}>
                                <p>
                                    <h4>Alias Name :</h4><span>{data?.AliasName}</span></p></Col>
                            <Col md={6}>
                                <p>
                                    <h4>Supplier Services : </h4>{data?.SupplierServiceName.map((item) => (
                                        <span>{item?.name},</span>
                                    ))}
                                </p></Col>
                            <Col md={3}>
                                <p>
                                    <h4>Pan Information : </h4>{data?.PanInformation}</p> </Col>
                            <Col md={3}>
                                <p>
                                    <h4>
                                        Payment Term:
                                    </h4>{data?.PaymentTerm}</p></Col>
                            <Col md={3}><p>
                                <h4>
                                    Default Destination:
                                </h4> {data?.DefaultDestination.map((item, index) => (
                                    <span>{item?.name},</span>
                                ))}
                            </p></Col>
                            <Col md={3}> <p>
                                <h4>Local Agent :</h4> {data?.LocalAgent}
                            </p></Col>
                        </Row>

                    ))}

                </Col> */}
                <Col lg={12}>
                    <Office partner_payload={{ Fk_partnerid: param?.id, Type: "Supplier" }} />
                </Col>
                <Col lg={12}>
                    <ContactPerson partner_payload={{ Fk_partnerid: param?.id, Type: "Supplier" }} />
                </Col>
                <Col lg={12}>
                    <CompanyDocument partner_payload={{ Fk_partnerid: param?.id, Type: "Supplier" }} />
                </Col>
                <Col lg={12}>
                    <BankDetail partner_payload={{ Fk_partnerid: param?.id, Type: "Supplier" }} />
                </Col>


            </Row>
        </>
    )
}
export default ViewSupplier;
