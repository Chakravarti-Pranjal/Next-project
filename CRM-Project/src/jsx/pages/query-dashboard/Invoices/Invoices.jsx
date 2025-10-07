import React from "react";

import { Card, Tab, Nav } from "react-bootstrap";
import ManaulInvoice from "./ManaulInvoice";
import ItemWiseInvoice from "./ItemWiseInvoice";
import useQueryData from "../../../../hooks/custom_hooks/useQueryData";

const Invoices = () => {
  const queryData = useQueryData();
  return (
    <Card>
      <Card.Body className="pt-0 ps-0 pe-0">
        <div className="custom-tab-1">
          <Tab.Container defaultActiveKey="ManaulInvoice">
            <Nav
              as="ul"
              className="nav-tabs"
              style={{ backgroundColor: " var(--rgba-primary-1) " }}
            >
              <Nav.Item as="li">
                <Nav.Link eventKey="ManaulInvoice">
                  <i className={`la la-inbox me-2 nav-icons`} />
                  <span className="nav-name">Invoice</span>
                </Nav.Link>
              </Nav.Item>
              {/* <Nav.Item as="li">
                                <Nav.Link
                                    eventKey="ItemWiseInvoice"
                                >
                                    <i className="fa-regular fa-bell me-2"></i>
                                    <span className="nav-name">Item Wise Invoice</span>
                                </Nav.Link>
                            </Nav.Item> */}
            </Nav>
            <Tab.Content className="pt-2">
              <Tab.Pane eventKey="ManaulInvoice" className="mt-2">
                <ManaulInvoice />
              </Tab.Pane>
              {/* <Tab.Pane eventKey="ItemWiseInvoice">
                                <ItemWiseInvoice />
                            </Tab.Pane> */}
            </Tab.Content>
          </Tab.Container>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Invoices;
