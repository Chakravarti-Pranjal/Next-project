import React, { lazy, useEffect, useRef, useState } from "react";
import Itineraries from "./Itineraries";
import { Card, Tab, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import Policies from "./policy";
import Commission from "./commission.jsx";
import { toast } from "react-toastify";
import PaxSlab from "./pax-slab-tab/index.jsx";
const Summary = lazy(() => import("./summary/index.jsx"));
// const PaxSlab = lazy(() => import("./pax-slab-tab/index.jsx"));

const Quotation = () => {
  const { queryData, qoutationData, isItineraryEditing } = useSelector(
    (data) => data?.queryReducer
  );
  const itinerariesRef = useRef();
  const { TourSummary, QueryInfo } = qoutationData;

  const [quotationFormValue, setQuotationFormValue] = useState({
    QueryId: queryData?.QueryAlphaNumId,
    // Subject: "Corenthum",
    QuotationNumber: qoutationData?.QuotationNumber,
    HotelCategory: "Single Hotel Category",
    PaxSlabType: "Single Slab",
    HotelMarkupType: "Service Wise Markup",
    HotelStarCategory: [],
    PackageID: "",
  });

  useEffect(() => {
    if (isItineraryEditing) {
      setQuotationFormValue({
        ...quotationFormValue,
        QueryId: queryData?.QueryAlphaNumId,
        QuotationNumber: qoutationData?.QuotationNumber,
        // Subject:qoutationData?.Header?.Subject,
        HotelCategory: qoutationData?.Header?.HotelCategory,
        HotelMarkupType: qoutationData?.Header?.HotelMarkupType,
        PaxSlabType: qoutationData?.Header?.PaxSlabType,
        PackageID: qoutationData?.Header?.PackageID,
        HotelStarCategory: qoutationData?.Header?.HotelStarCategories,
      });
    }
  }, [qoutationData, isItineraryEditing]);

  useEffect(() => {
    if (qoutationData != "") {
      itinerariesRef.current.click();
    }
  }, [qoutationData]);
  const [activeTab, setActiveTab] = useState("itineraries");

  // Function to handle the "Next" button click
  const handleNext = (currentTab) => {
    const tabOrder = [
      "itineraries",
      "policies",
      "commission",
      "summary",
      "pax-slab",
    ];
    const currentIndex = tabOrder.indexOf(currentTab);
    const nextIndex = (currentIndex + 1) % tabOrder.length;
    setActiveTab(tabOrder[nextIndex]);
  };
  const handleBack = (currentTab) => {
    const tabOrder = [
      "itineraries",
      "policies",
      "commission",
      "summary",
      "pax-slab",
    ];
    const currentIndex = tabOrder.indexOf(currentTab);
    const nextIndex = (currentIndex - 1) % tabOrder.length;
    setActiveTab(tabOrder[nextIndex]);
  };

  return (
    <Card>
      <Card.Body className="py-0 px-0 mt-3">
        <div className="custom-tab-1">
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav
              as="ul"
              className="nav-tabs d-flex justify-content-between custom-row-gap"
            >
              <div className="d-flex">
                <Nav.Item as="li" onClick={() => toast.dismiss()}>
                  <Nav.Link
                    eventKey="itineraries"
                    disabled={qoutationData != "" ? false : true}
                    ref={itinerariesRef}
                  >
                    <i className={`la la-home me-2 nav-icons`} />
                    <span className="nav-name">Itineraries</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li" onClick={() => toast.dismiss()}>
                  <Nav.Link
                    eventKey="policies"
                    disabled={qoutationData != "" ? false : true}
                  >
                    <i className={`la la-user me-2 nav-icons`} />
                    <span className="nav-name">Policies</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li" onClick={() => toast.dismiss()}>
                  <Nav.Link
                    eventKey="commission"
                    disabled={qoutationData != "" ? false : true}
                  >
                    <i className={`la la-phone me-2 nav-icons`} />
                    <span className="nav-name">Commission & Markup</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li" onClick={() => toast.dismiss()}>
                  <Nav.Link
                    eventKey="summary"
                    disabled={qoutationData != "" ? false : true}
                  >
                    <i className={`la la-phone me-2 nav-icons`} />
                    <span className="nav-name">Summary</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li" onClick={() => toast.dismiss()}>
                  <Nav.Link
                    eventKey={"pax-slab"}
                    disabled={qoutationData != "" ? false : true}
                  >
                    <i className={`la la-phone me-2 nav-icons`} />
                    <span className="nav-name">Pax Slab</span>
                  </Nav.Link>
                </Nav.Item>
              </div>
              <div className="d-flex gap-3 pb-1" style={{ overflowX: "auto" }}>
                <div className="pax-info">
                  <span>Total Nights</span>
                  <span>{TourSummary?.NumberOfNights}</span>
                </div>
                {QueryInfo?.Accomondation?.RoomInfo?.filter(
                  (room) => room?.NoOfPax != "" && room?.NoOfPax != null
                ).map((room, ind) => {
                  return (
                    <div className="pax-info" key={ind}>
                      <span>{room?.RoomType}</span>
                      <span>{room?.NoOfPax}</span>
                    </div>
                  );
                })}
                <div className="pax-info">
                  <span>Adult</span>
                  <span>{qoutationData?.Pax?.AdultCount}</span>
                </div>
                <div className="pax-info">
                  <span>Child</span>
                  <span>{qoutationData?.Pax?.ChildCount}</span>
                </div>
              </div>
            </Nav>
            <Tab.Content className="pt-2">
              <Tab.Pane eventKey="itineraries" className="mt-2">
                <Itineraries onNext={() => handleNext("itineraries")} />
              </Tab.Pane>
              <Tab.Pane eventKey="policies">
                <Policies
                  onNext={() => handleNext("policies")}
                  onBack={() => handleBack("policies")}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="commission">
                <Commission
                  onNext={() => handleNext("commission")}
                  onBack={() => handleBack("commission")}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="summary">
                <Summary
                  onNext={() => handleNext("summary")}
                  onBack={() => handleBack("summary")}
                />
              </Tab.Pane>
              <Tab.Pane eventKey={"pax-slab"} className="mt-2">
                <PaxSlab
                  onNext={() => handleNext("pax-slab")}
                  onBack={() => handleBack("pax-slab")}
                  paxSlab={quotationFormValue}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Quotation;
