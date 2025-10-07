import React, { lazy, useState } from "react";
import { Card, Tab, Nav } from "react-bootstrap";
const Reservationrequest = lazy(() =>
  import("./SupplierConfirmation/Reservationrequest")
);
import SupplierSelection from "./SupplierConfirmation/SupplierSelection";
const Finalprice = lazy(() => import("./SupplierConfirmation/Finalprice"));
import { useDispatch } from "react-redux";
import { apiCountIncrement } from "../../../store/actions/operationsAction/supplierconfirmation/reloadApiDataAction";

const SupplierConfirmation = () => {
  const tabKeys = ["SupplierSelection", "Reservationrequest", "Finalprice"];
  const [activeTab, setActiveTab] = useState(tabKeys[0]);

  const [mountedTabs, setMountedTabs] = useState([tabKeys[0]]); // Initially mount only the first tab
  const dispatch = useDispatch();

  // Log clicked tab
  const handleTabClick = (tabName) => {
    console.log(`Clicked tab: ${tabName}`);
    if (!mountedTabs.includes(tabName)) {
      setMountedTabs((prev) => [...prev, tabName]);
    }

    if (tabName === "Reservationrequest") {
      dispatch(apiCountIncrement());
    }

    setActiveTab(tabName);
  };

  // Navigate to next tab
  const handleNext = () => {
    const currentIndex = tabKeys.indexOf(activeTab);
    if (currentIndex < tabKeys.length - 1) {
      const nextTab = tabKeys[currentIndex + 1];
      handleTabClick(nextTab); // trigger same mount logic
    }
  };

  return (
    <Card>
      <Card.Body className="pt-0 ps-0 pe-0">
        <div className="custom-tab-1">
          <Tab.Container activeKey={activeTab}>
            <Nav
              as="ul"
              className="nav-tabs"
              style={{ backgroundColor: "var(--rgba-primary-1)" }}
            >
              {tabKeys.map((key, index) => (
                <Nav.Item as="li" key={key}>
                  <Nav.Link eventKey={key} onClick={() => handleTabClick(key)}>
                    {key === "SupplierSelection" && (
                      <>
                        <i className="la la-inbox me-2 nav-icons" />
                        <span className="nav-name">Supplier Selection</span>
                      </>
                    )}
                    {key === "Reservationrequest" && (
                      <>
                        <i className="fa-regular fa-bell me-2" />
                        <span className="nav-name">Reservation Request</span>
                      </>
                    )}
                    {key === "Finalprice" && (
                      <>
                        <i className="fa-solid fa-coins me-2" />
                        <span className="nav-name">Final Price</span>
                      </>
                    )}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            <Tab.Content className="pt-2">
              {mountedTabs.includes("SupplierSelection") && (
                <Tab.Pane eventKey="SupplierSelection" className="mt-2">
                  <SupplierSelection handleNext={handleNext} />
                </Tab.Pane>
              )}

              {mountedTabs.includes("Reservationrequest") && (
                <Tab.Pane eventKey="Reservationrequest">
                  <Reservationrequest handleNext={handleNext} />
                </Tab.Pane>
              )}

              {mountedTabs.includes("Finalprice") && (
                <Tab.Pane eventKey="Finalprice">
                  <Finalprice />
                </Tab.Pane>
              )}
            </Tab.Content>
          </Tab.Container>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SupplierConfirmation;
