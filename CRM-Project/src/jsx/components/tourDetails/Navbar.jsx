import React, { useEffect, useState } from 'react';
import { Card, Tab, Nav, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import ArrivalDeparture from './ArrivalDeparture';
import PaxDetails from './PaxDetails';
// import ClientVoucher from './ClientVoucher';
// import SupplierVoucher from './SupplierVoucher';

function Navbar() {
 

    return (
        <>
            <div className="custom-tab-1">
                <Tab.Container defaultActiveKey="ArrivalDeparture">
                    <>
                        <Nav as="ul" className="nav-tabs" style={{ backgroundColor: 'var(--rgba-primary-1)' }}>
                            <Nav.Item as="li">
                                <Nav.Link eventKey="ArrivalDeparture">
                                    <span className="nav-name">Arrival / Departure Details</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <Nav.Link eventKey="FlightTrain">
                                    <span className="nav-name">Flight / Train Details</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <Nav.Link eventKey="PaxDetails">
                                    <span className="nav-name">Pax Details</span>
                                </Nav.Link>
                            </Nav.Item>
                            <button type='button' className="btn edit-query-button-bg  py-1 font-size-10 rounded-1"
                                style={{ marginLeft: "auto", marginTop: "6px", marginBottom: "6px", marginRight: "6px" }}
                                onClick={() => setLgShow(true)}
                            >
                                CUTOFF PEROID
                            </button>
                        </Nav>

                        <Tab.Content className="pt-2">
                            <Tab.Pane eventKey="ArrivalDeparture">
                                <ArrivalDeparture />
                            </Tab.Pane>
                            <Tab.Pane eventKey="FlightTrain">
                                FlightTrain
                            </Tab.Pane>
                            <Tab.Pane eventKey="PaxDetails">
                                <PaxDetails />
                            </Tab.Pane>
                        </Tab.Content>
                    </>
                </Tab.Container>
            </div>
            <Modal
                size="md"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        CUTOFF PEROID
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: "10px" }}>
                    <div className="row form-row-gap mb-3 w-50 mx-auto">

                        <div className="col-12 d-flex align-items-center gap-3">
                            <label style={{ whiteSpace: "nowrap", fontSize: "11px", minWidth: "80px" }}>
                                Hotel :
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                className="form-control form-control-sm"
                                name="HotelName"
                            />
                            <div className="form-check check-sm d-flex align-items-center">
                                <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                            </div>
                        </div>
                        <div className="col-12 d-flex align-items-center gap-3">
                            <label style={{ whiteSpace: "nowrap", fontSize: "11px", minWidth: "80px" }}>
                                Flight :
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                className="form-control form-control-sm"
                                name="Flight"
                            />
                            <div className="form-check check-sm d-flex align-items-center">
                                <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                            </div>
                        </div>
                        <div className="col-12 d-flex align-items-center gap-3">
                            <label style={{ whiteSpace: "nowrap", fontSize: "11px", minWidth: "80px" }}>
                                Transport :
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                className="form-control form-control-sm"
                                name="Transport"
                            />
                            <div className="form-check check-sm d-flex align-items-center">
                                <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                            </div>
                        </div>
                        <div className="col-12 d-flex align-items-center gap-3">
                            <label style={{ whiteSpace: "nowrap", fontSize: "11px", minWidth: "80px" }}>
                                General Train :
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                className="form-control form-control-sm"
                                name="General Train"
                            />
                            <div className="form-check check-sm d-flex align-items-center">
                                <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                            </div>
                        </div>
                        <div className="col-12 d-flex align-items-center gap-3">
                            <label style={{ whiteSpace: "nowrap", fontSize: "11px", minWidth: "80px" }}>
                                Luxury Train :
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                className="form-control form-control-sm"
                                name="Luxury Train"
                            />
                            <div className="form-check check-sm d-flex align-items-center">
                                <input type="checkbox" className="form-check-input height-em-1 width-em-1" />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Navbar;
