import React, { useState } from "react";
import { Card, Tab, Nav } from "react-bootstrap";
import Hotel from "./Hotel";
import Transport from "./Transport";

const Costsheet = () => {
  const [activeTab, setActiveTab] = useState("hotel");

  const handleNext = (currentTab) => {
    const tabOrder = ["transport", "hotel"];
    const currentIndex = tabOrder.indexOf(currentTab);
    const nextIndex = (currentIndex + 1) % tabOrder.length;
    setActiveTab(tabOrder[nextIndex]);
  };

  return (
    <Card>
      <Card.Body className="py-0 px-0">
        <div className="custom-tab-1">
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav as="ul" className="nav-tabs d-flex justify-content-start custom-row-gap">
              <Nav.Item as="li">
                <Nav.Link eventKey="hotel">
                  <span className="nav-name fs-4">Hotel</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link eventKey="transport">
                  <span className="nav-name fs-4">Transport</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="">
              <Tab.Pane eventKey="hotel" className="mt-2">
                {/* Hotel Content< */}
                <Hotel handleNext={handleNext} />
              </Tab.Pane>
              <Tab.Pane eventKey="transport" className="mt-2">
                {/* Transport Content */}
                <Transport handleNext={handleNext} />
              </Tab.Pane>

            </Tab.Content>
          </Tab.Container>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Costsheet;