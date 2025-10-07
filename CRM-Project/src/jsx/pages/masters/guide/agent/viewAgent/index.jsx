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
import { axiosOther } from "../../../../../../http/axios_base_url";
import "../../../../../../scss/main.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Office from "../../../../../layouts/common/office";
import ContactPerson from "../../../../../layouts/common/contactPerson";
import CompanyDocument from "../../../../../layouts/common/companyDocument";
import BankDetail from "../../../../../layouts/common/bankDetail";
import Task from "../../../../../layouts/common/task";
import Call from "../../../../../layouts/common/call";
import Meetings from "../../../../../layouts/common/meetings";
const ViewAgent = () => {
  const param = useParams();
  const [id, setId] = useState();

  const [countrylist, setCountrylist] = useState([]);
  const [divisionlist, setDivisionlist] = useState([]);
  const [agentlist, setAgentlist] = useState([]);
  const [statelist, setStatelist] = useState([]);
  const [citylist, setCitylist] = useState([]);
  const navigate = useNavigate();
  console.log(agentlist, "agentlist")

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
      const response = await axiosOther.post("agentlist", {
        BusinessType: 1,
        id: param?.id,
      });
      setAgentlist(response.data.DataList);
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
  useEffect(() => {
    getDataToServer();
    setId(param?.id);
  }, []);
  // console.log(agentlist, "fdxdfx")
  return (
    <>
      <Row>
        <Col lg={12} className="p-0">
          <Card>
            <Card.Header className="py-1">
              <Card.Title>Company Information</Card.Title>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-dark btn-custom-size"
                  name="SaveButton"
                  onClick={() => navigate("/agent")}
                >
                  <span className="me-1">Back</span>
                  <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                </button>
              </div>

            </Card.Header>
            {agentlist &&
              agentlist?.length > 0 &&
              agentlist.map((data, index) => (
                <Row className="p-3 pb-0">
                  <Col md={3}>
                    <p>
                      <h4>Company Name </h4>
                      <span>{data?.CompanyName}</span>
                    </p>
                  </Col>
                  <Col md={3}>
                    <p>
                      <h4>Sales Person </h4>
                      <span>{data?.SalesPersonName}</span>
                    </p>
                  </Col>
                  <Col md={3}>
                    <p>
                      <h4>Operation Person</h4>
                      <span>{data?.OperationsPersonName}</span>
                    </p>
                  </Col>
                  <Col md={3}>
                    <p>
                      <h4>Market Type </h4>
                      {data?.MarketTypeName}
                    </p>
                  </Col>
                  <Col md={3}>
                    <p>
                      <h4>Competitor </h4>
                      {data?.Competitor}
                    </p>{" "}
                  </Col>
                  <Col md={3}>
                    <p>
                      <h4>Nationality</h4>
                      {data?.NationalityName}
                    </p>
                  </Col>
                  <Col md={3}>
                    <p>
                      <h4>Preferred Language</h4> {data?.PreferredLanguageName}
                    </p>
                  </Col>
                  {/* {console.log(data?.PreferredLanguageName, "language.data.DataList")} */}
                  <Col md={3}>
                    <p>
                      <h4>Tour Type</h4>
                      {data?.TourTypeName}
                    </p>
                  </Col>
                  <Col md={3}>
                    <p className="mb-0">
                      <h4>Category</h4> {data?.Category}
                    </p>
                  </Col>
                </Row>
              ))}
          </Card>
        </Col>

        <Col lg={12}>
          <Office
            partner_payload={{ Fk_partnerid: param?.id, Type: "Agent", CompanyNmae: agentlist }}
          />
        </Col>
        <Col lg={12}>
          <ContactPerson
            partner_payload={{ Fk_partnerid: param?.id, Type: "Agent", CompanyNmae: agentlist }}
          />
        </Col>
        <Col lg={12}>
          <CompanyDocument
            partner_payload={{ Fk_partnerid: param?.id, Type: "Agent", CompanyNmae: agentlist }}
          />
        </Col>
        <Col lg={12}>
          <BankDetail
            partner_payload={{ Fk_partnerid: param?.id, Type: "Agent", CompanyNmae: agentlist }}
          />
        </Col>
        <Col lg={12}>
          <Call partner_payload={{ Fk_partnerid: param?.id, Type: "Agent", CompanyNmae: agentlist }} />
        </Col>
        <Col lg={12}>
          <Meetings
            partner_payload={{ Fk_partnerid: param?.id, Type: "Agent", CompanyNmae: agentlist }}
          />
        </Col>
        <Col lg={12}>
          <Task partner_payload={{ Fk_partnerid: param?.id, Type: "Agent", CompanyNmae: agentlist }} />
        </Col>
      </Row>
    </>
  );
};
export default ViewAgent;
