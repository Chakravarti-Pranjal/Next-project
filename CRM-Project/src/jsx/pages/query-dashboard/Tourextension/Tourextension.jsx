import React from "react";

import { Card, Tab, Nav } from "react-bootstrap";
import Guestlist from "./Guestlist";
import Taskscheduling from "./Taskscheduling";
import Guestlists from "./Guestlists";
import useQueryData from "../../../../hooks/custom_hooks/useQueryData";
import AgentWelcomeLetter from "./AgentWelcomeLetter";
import FtotourCard from "./FtotourCard";
import CompactToiurCard from "./CompactToiurCard";
import TourCard from "./TourCard";
import TourStatus from "./TourStatus";
import BriefingSheet from "./BriefingSheet";
import RoomingList from "./RoomingList";
import BriffingList from "./BriffingList";
import FeedbackList from "./FeedbackList";
import PLACard from "./PLACard";
import TransportAllocationChart from "./TransportAllocationChart";
import GuideAllocationChart from "./GuideAllocationChart";
import ContactList from "./ContactList";

const Tourextension = () => {
  const [opentab, setOpentab] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState("GuestList");

  const queryData = useQueryData();
  return (
    <Card>
      <Card.Body className="pt-0 ps-0 pe-0">
        <div className="custom-tab-1 custom-tab-2">
          {/* <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}> */}

          <Tab.Container
            // defaultActiveKey="GuestList"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
          >
            <Nav
              as="ul"
              className="nav-tabs"
              style={{ backgroundColor: " var(--rgba-primary-1) " }}
            >
              <Nav.Item as="li">
                <Nav.Link eventKey="GuestList">
                  <span className="nav-name">Guest List</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link eventKey="RoomingList">
                  <span className="nav-name">Rooming List</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="ContactList"
                // disabled={qoutationData != "" ? false : true}
                >
                  <span className="nav-name">Contact List</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="TaskScheduling"
                // disabled={qoutationData != "" ? false : true}
                >
                  <span className="nav-name">Task Scheduling</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  onClick={() => setOpentab(opentab + 1)}
                  eventKey="TourCard"
                // disabled={qoutationData != "" ? false : true}
                >
                  <span className="nav-name">Tour Card</span>
                </Nav.Link>
              </Nav.Item>
              {/* <Nav.Item as="li">
                <Nav.Link
                  onClick={() => setOpentab(opentab + 1)}
                  eventKey="TourStatus"
                // disabled={qoutationData != "" ? false : true}
                >
                  <span className="nav-name">Tour Status</span>
                </Nav.Link>
              </Nav.Item> */}
              {/* <Nav.Item as="li">
                <Nav.Link
                  onClick={() => setOpentab(opentab + 1)}
                  eventKey="FTOTourCard"
                // disabled={qoutationData != "" ? false : true}
                >
                  <span className="nav-name">FTO Tour Card</span>
                </Nav.Link>
              </Nav.Item> */}
              {/* <Nav.Item as="li">
                <Nav.Link
                  eventKey="AssignTourManager"
                // disabled={qoutationData != "" ? false : true}
                >
                  <span className="nav-name">Assign Tour Manager</span>
                </Nav.Link>
              </Nav.Item> */}
              <Nav.Item as="li">
                <Nav.Link
                  onClick={() => setOpentab(opentab + 1)}
                  eventKey="AgentWelcomeLetter"
                // disabled={qoutationData != "" ? false : true}
                >
                  <span className="nav-name">Welcome Letter</span>
                </Nav.Link>
              </Nav.Item>{" "}
              <Nav.Item as="li">
                <Nav.Link
                  onClick={() => setOpentab(opentab + 1)}
                  eventKey="Compacttoiurcard"
                // disabled={qoutationData != "" ? false : true}
                >
                  <span className="nav-name">Compact Tour Card</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  onClick={() => setOpentab(opentab + 1)}
                  // eventKey="BriefingSheet"
                  eventKey="BriffingList"
                >
                  <span className="nav-name">Briefing Sheet</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  onClick={() => setOpentab(opentab + 1)}
                  // eventKey="BriefingSheet"
                  eventKey="FeedbackForm"
                >
                  <span className="nav-name">Feedback Form</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  onClick={() => setOpentab(opentab + 1)}
                  // eventKey="BriefingSheet"
                  eventKey="PLACard"
                >
                  <span className="nav-name">PLA Card</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  onClick={() => setOpentab(opentab + 1)}
                  // eventKey="BriefingSheet"
                  eventKey="TransportAllocationChart"
                >
                  <span className="nav-name">Transport Allocation Chart</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  onClick={() => setOpentab(opentab + 1)}
                  // eventKey="BriefingSheet"
                  eventKey="GuideAllocationChart"
                >
                  <span className="nav-name">Guide Allocation Chart</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="pt-2">
              <Tab.Pane eventKey="GuestList" className="mt-2">
                <Guestlists setActiveTab={setActiveTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="RoomingList" className="mt-2">
                <RoomingList setActiveTab={setActiveTab} activeTab={activeTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="ContactList" className="mt-2">
                <ContactList setActiveTab={setActiveTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="TaskScheduling">
                <Taskscheduling setActiveTab={setActiveTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="Compacttoiurcard">
                <CompactToiurCard setActiveTab={setActiveTab} />
              </Tab.Pane>{" "}
              <Tab.Pane eventKey="TourCard">
                <TourCard setActiveTab={setActiveTab} />
              </Tab.Pane>
              {/* <Tab.Pane eventKey="ContactList"></Tab.Pane> */}
              <Tab.Pane eventKey="FTOTourCard">
                <FtotourCard opentab={opentab} />
              </Tab.Pane>
              <Tab.Pane eventKey="TourStatus">
                <TourStatus setActiveTab={setActiveTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="AgentWelcomeLetter">
                <AgentWelcomeLetter setActiveTab={setActiveTab} />
              </Tab.Pane>
              {/* <Tab.Pane eventKey="BriefingSheet">
                <BriefingSheet />
              </Tab.Pane> */}
              <Tab.Pane eventKey="BriffingList">
                <BriffingList setActiveTab={setActiveTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="FeedbackForm">
                <FeedbackList setActiveTab={setActiveTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="PLACard">
                <PLACard setActiveTab={setActiveTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="TransportAllocationChart">
                <TransportAllocationChart setActiveTab={setActiveTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="GuideAllocationChart">
                <GuideAllocationChart setActiveTab={setActiveTab} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Tourextension;
