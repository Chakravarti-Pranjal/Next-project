import React, { createContext, useState } from "react";
import { NavLink, useLocation, Outlet } from "react-router-dom";
import Popup from "./Popup";
import QoutationList from "./QoutationList";
import Itineraries from "./itenararies/Itineraries";
import Commission from "./Commission.jsx";
import Policies from "./Policies.jsx";
import Summary from "./Summary.jsx";
import { Tab, Nav } from "react-bootstrap";

const quotationContext = createContext();

const Quotation = () => {
  const [quotationGlobalData, setQuotationGlobalData] = useState(
    JSON.parse(localStorage.getItem("quotation-data"))
  );
  const [showItinarary, setShowItinarary] = useState(false);

  return (
    <>
      <quotationContext.Provider
        value={{
          quotationGlobalData,
          setQuotationGlobalData,
          showItinarary,
          setShowItinarary,
        }}
      >
        {/* {quotationGlobalData != null ? ( */}
        <div className="container-fluid mt-2 mb-5">
          <div className="row">
            <div className="col-12 p-0">
              <div className="row ">
                <div className="col-12 col-md-3 ps-0">
                  <p className="d-flex gap-2">
                    Lead Pax Name :
                    <span className="pl-2 text-success">
                      <i className="fa-solid fa-pen-to-square"></i> Rahul Kumar
                    </span>
                  </p>
                </div>
                <div className="col-12 col-md-8 d-flex gap-2 flex-column flex-md-row">
                  <p>
                    <span className="font-bold">
                      Define Pax Slab (Min Pax: 10 | Max PAX: 10)
                    </span>
                    | Single Hotel Categoy
                  </p>
                  <div className="width-120 height-20 bg-primary d-flex justify-content-center align-items-center gap-2 p-1 text-white">
                    <i className="fa-solid fa-square-plus"></i> Tour Log
                  </div>
                  <div className="width-120 height-20 bg-primary d-flex justify-content-center align-items-center gap-2 p-1 text-white">
                    <i className="fa-solid fa-square-plus"></i> Tour Change
                  </div>
                </div>
                <div className="col-12 col-md-1 d-flex justify-content-end pe-0">
                  <button className="height-20 btn border rounded-pill d-flex justify-content-center align-items-center">
                    Back
                  </button>
                </div>
              </div>
            </div>
            {/* all popups */}
            <Popup />
            {/* all popups */}
            <div className="col-12 p-0 mt-3">
              {/* <ul
                class="nav nav-tabs custom-tabs border d-flex justify-content-around radius-top-left radius-top-right mb-0"
                id="myTab"
                role="tablist"
              >
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link custom-tab-link active"
                    id="home-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#itinararies"
                    type="button"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    Itinararies
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link custom-tab-link"
                    id="profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#polocies"
                    type="button"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="false"
                  >
                    Policies
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link custom-tab-link"
                    id="profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#commissionandmarkup"
                    type="button"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="false"
                  >
                    Commission & Markup
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link custom-tab-link"
                    id="profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#summary"
                    type="button"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="false"
                  >
                    Summary
                  </button>
                </li>
              </ul>
              <div class="tab-content" id="myTabContent">
                <div
                  class="tab-pane fade show active"
                  id="itinararies"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <Itineraries />
                </div>
                <div
                  class="tab-pane fade"
                  id="polocies"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  <Policies />
                </div>
                <div
                  class="tab-pane fade"
                  id="commissionandmarkup"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  <Commission />
                </div>
                <div
                  class="tab-pane fade"
                  id="summary"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  <Summary />
                </div>
              </div> */}
              <div className="custom-tab-1">
                <Tab.Container defaultActiveKey={"itinerary"}>
                  <Nav
                    as="ul"
                    className="nav-tabs d-flex justify-content-between"
                  >
                    <Nav.Item as="li">
                      <Nav.Link eventKey="itinerary">
                        <i className={`la la-summary me-2`} />
                        Itinararies
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link eventKey="policies">
                        <i className={`la la-summary me-2`} />
                        Policies
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link eventKey="commisionandmarkup">
                        <i className={`la la-summary me-2`} />
                        Commision & Markup
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link eventKey="summary">
                        <i className={`la la-summary me-2`} />
                        Summary
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link eventKey="paxSlab">
                        <i className={`la la-summary me-2`} />
                        Pax Slab
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane eventKey={"itinerary"}>
                      <Itineraries />
                    </Tab.Pane>
                    <Tab.Pane eventKey={"policies"}>
                      <Policies />
                    </Tab.Pane>
                    <Tab.Pane eventKey={"commisionandmarkup"}>
                      <Commission />
                    </Tab.Pane>
                    <Tab.Pane eventKey={"summary"}>
                      <Summary />
                    </Tab.Pane>
                    <Tab.Pane eventKey={"paxSlab"}>
                      <Summary />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </div>
          </div>
        </div>
        {/* ) : (
          <QoutationList />
        )} */}
      </quotationContext.Provider>
    </>
  );
};

export default Quotation;
export { quotationContext };
