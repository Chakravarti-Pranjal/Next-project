import React from "react";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import { Tab, Nav } from "react-bootstrap";
import YearlyChart from "./YearlyChart";
import MonthlyChart from "./MonthlyChart";
import Weekly from "./Weekly";

const ChartBarApex = loadable(() => pMinDelay(import("./ChartBarApex"), 1000));
const ChartBarApex2 = loadable(() =>
  pMinDelay(import("./ChartBarApex2"), 1000)
);
const ChartBarApex3 = loadable(() =>
  pMinDelay(import("./ChartBarApex3"), 1000)
);

const ReservationStats = () => {
  return (
    <>
      <Tab.Container defaultActiveKey="Monthly">
        <div className=" mb-0 m-0 p-0" style={{ height: "100%" }}>
          <div className="card-header p-0 py-1 px-3 d-flex justify-content-between">
            {/* <h4 className="fs-15">Reservation Stats</h4> */}
            <h4 className="fs-15">Query Recieved</h4>
            <div className="card-action coin-tabs">
              <Nav as="ul" className="nav nav-tabs ">
                <Nav.Item as="li" className="nav-item">
                  <Nav.Link eventKey="Daily" className="nav-link p-sm-1">Week</Nav.Link>
                </Nav.Item>
                <Nav.Item as="li" className="nav-item">
                  <Nav.Link eventKey="Weekly" className="nav-link p-sm-1">Month</Nav.Link>
                </Nav.Item>
                <Nav.Item as="li" className="nav-item">
                  <Nav.Link className="nav-link p-sm-1 " eventKey="Monthly">
                    Year
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </div>
          <div className="card-body p-0">
            {/* <div className="d-flex flex-wrap">
              <span className="me-sm-5 me-0 font-w500">
                <svg
                  className="me-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                >
                  <rect width="13" height="13" fill="#135846" />
                </svg>
                Check In
              </span>
              <span className="fs-16 font-w600 me-4">
                23,451{" "}
                <small className="text-success fs-12 font-w400">+0.4%</small>
              </span>
              <span className="me-sm-5 ms-0 font-w500">
                <svg
                  className="me-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                >
                  <rect width="13" height="13" fill="#E23428" />
                </svg>
                Check Out
              </span>
              <span className="fs-16 font-w600">20,441</span>
            </div> */}
            <Tab.Content>
              <Tab.Pane className="tab-pane" eventKey="Daily">
                <div id="chartBar" className="chartBar fs-6">
                  <Weekly />
                </div>
              </Tab.Pane>
              <Tab.Pane className="tab-pane" eventKey="Weekly">
                <div id="chartBar1" className="chartBar fs-6">
                  <MonthlyChart />
                </div>
              </Tab.Pane>
              <Tab.Pane className="tab-pane" eventKey="Monthly">
                <div id="chartBar2" className="chartBar fs-6">
                  <YearlyChart />
                </div>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </div>
      </Tab.Container>
    </>
  );
};
export default ReservationStats;
