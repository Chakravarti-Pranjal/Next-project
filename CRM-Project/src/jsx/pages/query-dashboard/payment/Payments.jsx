import React, { useEffect, useState } from "react";
import { Card, Tab, Nav } from "react-bootstrap";
import SupplierPaymentRequest from "./supplierPaymentRequest/SupplierPaymentRequest";
import AgentPaymentRequest from "./agentPaymentRequest/AgentPaymentRequest";
import ExpenseEntry from "./ExpenseEntry";
import useQueryData from "../../../../hooks/custom_hooks/useQueryData";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";

const Payments = () => {
  const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

  const [quotationData, setQuotationData] = useState([]);
  const [selectedQuotationOption, setSelectedQuotationOption] = useState("");
  const navigate = useNavigate();

  const getDataFromApi = async () => {
    try {
      const { data } = await axiosOther.post("listqueryquotation", {
        QueryId: queryQuotation?.QueryID,
        QuotationNo: "",
      });

      if (data?.success && data?.data) {
        const updatedData = data?.data
          ?.filter((quotation) => quotation?.QuotationNumber?.includes("Final"))
          .map((quotation) => ({
            QoutationNum: quotation?.QuotationNumber,
            TourId: quotation?.TourId,
          }));

        console.log(updatedData, "updatedData");
        setQuotationData(updatedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataFromApi();
  }, []);

  useEffect(() => {
    if (quotationData && quotationData.length > 0) {
      const defaultValue = quotationData[0].QoutationNum;
      setSelectedQuotationOption(defaultValue);
      const updateQueryQuotation = {
        ...queryQuotation,
        QoutationNum: defaultValue,
      };
      localStorage.setItem(
        "Query_Qoutation",
        JSON.stringify(updateQueryQuotation)
      );
    }
  }, [quotationData]);

  const handleQuotationChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedQuotationOption(selectedValue);
  };

  console.log(selectedQuotationOption, "selectedQuotationOption");

  return (
    <Card>
      <Card.Body className="pt-0 ps-0 pe-0">
        <div className="custom-tab-1">
          <Tab.Container defaultActiveKey="SupplierPaymentRequest">
            <Nav
              as="ul"
              className="nav-tabs"
              style={{ backgroundColor: " var(--rgba-primary-1) " }}
            >
              <Nav.Item as="li">
                <Nav.Link eventKey="SupplierPaymentRequest">
                  <i className={`la la-inbox me-2 nav-icons`} />
                  <span className="nav-name">Supplier Payment Request</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="AgentPaymentRequest"
                // disabled={qoutationData != "" ? false : true}
                >
                  <i className="fa-regular fa-bell me-2"></i>
                  <span className="nav-name">Agent Payment Request</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="ExpenseEntry"
                // disabled={qoutationData != "" ? false : true}
                >
                  <i className="fa-solid fa-coins me-2"></i>
                  <span className="nav-name">Expense Entry</span>
                </Nav.Link>
              </Nav.Item>

              <div className="d-flex justify-content-end align-items-center ms-auto">
                <select
                  style={{ width: "170px" }}
                  className="form-control form-control-sm me-2"
                  value={selectedQuotationOption}
                  onChange={handleQuotationChange}
                >
                  {quotationData?.map((list, index) => (
                    <option key={index} value={list?.QoutationNum}>
                      {list?.QoutationNum}
                    </option>
                  ))}
                </select>
                <div>
                  <button className="btn btn-dark btn-custom-size me-2" onClick={() => navigate(-1)}>
                    <span className="me-1">Back</span>
                    <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                  </button>
                  <button
                    className="btn btn-primary btn-custom-size "
                    name="SaveButton"
                    onClick={() => navigate("/query/vouchers")}
                  >
                    <span className="me-1">Next</span>
                    <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
                  </button>
                </div>
              </div>

            </Nav>
            <Tab.Content className="pt-2">
              <Tab.Pane eventKey="SupplierPaymentRequest" className="mt-2">
                <SupplierPaymentRequest
                  selectedQuotationOption={selectedQuotationOption}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="AgentPaymentRequest">
                <AgentPaymentRequest
                  selectedQuotationOption={selectedQuotationOption}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="ExpenseEntry">
                <ExpenseEntry />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Payments;
