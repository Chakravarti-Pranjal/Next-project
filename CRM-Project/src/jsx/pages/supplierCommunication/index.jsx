import React, { useEffect, useState } from "react";
import { Card, Tab, Nav } from "react-bootstrap";
import Communication from "./communication";
import Confirmation from "./SupplierConfirmation/SupplierSelection";
import { useSelector, useDispatch } from "react-redux";
import SupplierConfirmation from "./SupplierConfirmation";
import { useLocation, useNavigate } from "react-router-dom";
import RoomingList from "./SupplierConfirmation/RoomingList";

const SupplierTab = () => {
  const { qoutationData } = useSelector((data) => data?.queryReducer);

  const activeTab = useSelector(
    (state) => state.activeTabOperationReducer.selectTab
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { state } = useLocation();

  useEffect(() => {
    if (state === true) {
      dispatch({
        type: "CHANGE_TAB",
        payload: "confirmation",
      });
    }
  }, [state, dispatch]);

  return (
    <Card>
      <Card.Body className="py-0 px-0 mt-3">
        <div className="custom-tab-1">
          <Tab.Container
            activeKey={activeTab}
            onSelect={(k) =>
              dispatch({
                type: "CHANGE_TAB",
                payload: k,
              })
            }
          >
            <Nav as="ul" className="nav-tabs">
              <Nav.Item as="li">
                <Nav.Link eventKey="communication">
                  <i className="la la-inbox me-2 nav-icons" />
                  <span className="nav-name">Supplier Communication</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link eventKey="confirmation">
                  <i className="la la-check-double me-2 nav-icons" />
                  <span className="nav-name">Supplier Confirmation</span>
                </Nav.Link>
              </Nav.Item>
              {/* <Nav.Item as="li">
                <Nav.Link eventKey="voucher">
                  <i className="la la-ticket me-2 nav-icons" />
                  <span className="nav-name">Supplier Voucher</span>
                </Nav.Link>
              </Nav.Item> */}
              {/* <Nav.Item as="li">
                <Nav.Link eventKey="availability">
                  <i className="la la-user me-2 nav-icons" />
                  <span className="nav-name">Supplier Availability</span>
                </Nav.Link>
              </Nav.Item> */}
              {/* <Nav.Item as="li">
                <Nav.Link eventKey="rooming">
                  <i className="la la-list me-2 nav-icons" />
                  <span className="nav-name">Supplier Rooming List</span>
                </Nav.Link>
              </Nav.Item> */}
              <div className="ms-auto">
                <button className="btn btn-dark btn-custom-size me-2" onClick={() => navigate(-1)}>
                  <span className="me-1">Back</span>
                  <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                </button>
                <button
                  className="btn btn-primary btn-custom-size "
                  name="SaveButton"
                  onClick={() => navigate("/query/payments")}
                >
                  <span className="me-1">Next</span>
                  <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
                </button>
              </div>
            </Nav>

            <Tab.Content className="pt-2">
              <Tab.Pane eventKey="communication">
                <Communication hotelData={state} />
              </Tab.Pane>
              <Tab.Pane eventKey="confirmation" className="mt-2">
                <SupplierConfirmation />
              </Tab.Pane>
              <Tab.Pane eventKey="voucher">
                <Confirmation />
              </Tab.Pane>
              <Tab.Pane eventKey="availability">
                <Confirmation />
              </Tab.Pane>
              <Tab.Pane eventKey="rooming">
                {/* <Confirmation /> */}
                {/* <RoomingList /> */}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SupplierTab;
