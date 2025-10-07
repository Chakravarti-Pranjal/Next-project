import React, { lazy, useEffect, useRef, useState, Suspense } from "react";
import { Card, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  paxSlabApiLoadAction,
  resetPaxSlabApiLoadAction,
  commissionLoadAction,
  resetcommissionLoadAction,
} from "../../../../store/actions/createExcortLocalForeignerAction.js";

// Lazy load all tab components
const Itineraries = lazy(() => import("./Itineraries"));
const Policies = lazy(() => import("./policy"));
const Commission = lazy(() => import("./commission.jsx"));
const Summary = lazy(() => import("./summary/index.jsx"));
const PaxSlab = lazy(() => import("./pax-slab-tab/index.jsx"));

const Quotation = () => {
  const { queryData, qoutationData, isItineraryEditing } = useSelector(
    (data) => data?.queryReducer
  );
  const itinerariesRef = useRef();
  const { TourSummary, QueryInfo } = qoutationData;
  const dispatch = useDispatch();

  const [quotationFormValue, setQuotationFormValue] = useState({
    QueryId: queryData?.QueryAlphaNumId,
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
  // Track which tabs have been visited to mount their components
  const [visitedTabs, setVisitedTabs] = useState({ itineraries: true });

  const handleTabSelect = (tab) => {
    // console.log(tab, "TAB67");

    if (tab == "pax-slab") {
      dispatch(paxSlabApiLoadAction());
    }
    if (tab == "commission") {
      dispatch(commissionLoadAction());
    }

    setActiveTab(tab);
    setVisitedTabs((prev) => ({ ...prev, [tab]: true }));
    toast.dismiss();
  };

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
    const nextTab = tabOrder[nextIndex];

    if (nextTab == "pax-slab") {
      dispatch(paxSlabApiLoadAction());
    }
    if (nextTab == "commission") {
      dispatch(commissionLoadAction());
    }

    setActiveTab(nextTab);
    setVisitedTabs((prev) => ({ ...prev, [nextTab]: true }));
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
    const prevIndex = (currentIndex - 1) % tabOrder.length;
    const prevTab = tabOrder[prevIndex];

    // console.log("Switching to previous tab:", prevTab);

    if (prevTab == "pax-slab") {
      dispatch(paxSlabApiLoadAction());
    }
    if (prevTab == "commission") {
      dispatch(commissionLoadAction());
    }

    setActiveTab(prevTab);
    setVisitedTabs((prev) => ({ ...prev, [prevTab]: true }));
  };

  useEffect(() => {
    return () => {
      dispatch(resetPaxSlabApiLoadAction());
    };
  }, []);
  useEffect(() => {
    return () => {
      dispatch(resetcommissionLoadAction());
    };
  }, []);

  return (
    <Card>
      <Card.Body className="py-0 px-0 mt-3">
        <div className="custom-tab-1">
          <Nav
            as="ul"
            className="nav-tabs d-flex justify-content-between custom-row-gap"
          >
            <div className="d-flex">
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="itineraries"
                  active={activeTab === "itineraries"}
                  onClick={() => handleTabSelect("itineraries")}
                  disabled={qoutationData != "" ? false : true}
                  ref={itinerariesRef}
                >
                  <i className={`la la-home me-2 nav-icons`} />
                  <span className="nav-name">Itineraries</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="policies"
                  active={activeTab === "policies"}
                  onClick={() => handleTabSelect("policies")}
                  disabled={qoutationData != "" ? false : true}
                >
                  <i className={`la la-user me-2 nav-icons`} />
                  <span className="nav-name">T&C</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="commission"
                  active={activeTab === "commission"}
                  onClick={() => handleTabSelect("commission")}
                  disabled={qoutationData != "" ? false : true}
                >
                  <i className={`la la-phone me-2 nav-icons`} />
                  <span className="nav-name">Markup & Commission</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="summary"
                  active={activeTab === "summary"}
                  onClick={() => handleTabSelect("summary")}
                  disabled={qoutationData != "" ? false : true}
                >
                  <i className={`la la-phone me-2 nav-icons`} />
                  <span className="nav-name">Summary</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="pax-slab"
                  active={activeTab === "pax-slab"}
                  onClick={() => handleTabSelect("pax-slab")}
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
              ).map((room, ind) => (
                <div className="pax-info" key={ind}>
                  <span>{room?.RoomType}</span>
                  <span>{room?.NoOfPax}</span>
                </div>
              ))}
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

          {/* Tab Content with Persistent Components */}
          <div className="tab-content pt-2">
            <Suspense fallback={<div>Loading...</div>}>
              <div
                style={{
                  display: activeTab === "itineraries" ? "block" : "none",
                }}
              >
                {visitedTabs.itineraries && (
                  <Itineraries onNext={() => handleNext("itineraries")} />
                )}
              </div>
              <div
                style={{
                  display: activeTab === "policies" ? "block" : "none",
                }}
              >
                {visitedTabs.policies && (
                  <Policies
                    onNext={() => handleNext("policies")}
                    onBack={() => handleBack("policies")}
                    isActive={activeTab === "policies"}
                  />
                )}
              </div>
              <div
                style={{
                  display: activeTab === "commission" ? "block" : "none",
                }}
              >
                {visitedTabs.commission && (
                  <Commission
                    onNext={() => handleNext("commission")}
                    onBack={() => handleBack("commission")}
                  />
                )}
              </div>
              <div
                style={{
                  display: activeTab === "summary" ? "block" : "none",
                }}
              >
                {visitedTabs.summary && (
                  <Summary
                    onNext={() => handleNext("summary")}
                    onBack={() => handleBack("summary")}
                  />
                )}
              </div>
              <div
                style={{
                  display: activeTab === "pax-slab" ? "block" : "none",
                }}
              >
                {visitedTabs["pax-slab"] && (
                  <PaxSlab
                    onNext={() => handleNext("pax-slab")}
                    onBack={() => handleBack("pax-slab")}
                    paxSlab={quotationFormValue}
                  />
                )}
              </div>
            </Suspense>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Quotation;
