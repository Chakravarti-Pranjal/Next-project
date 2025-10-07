import React from 'react'
import { Card, Tab, Nav } from "react-bootstrap";
import Hotel from './Hotel';
import Entrance from './Entrance';
import Transfer from './Transfer';
import Transportation from './Transportation';
import Activity from './Activity';
const Crmrate = () => {
    return (
        <Card  >
            <Card.Body className="pt-0 ps-0 pe-0" >
                <div className="row">
                    <div className="col-12">
                        
                    </div>
                </div>
                <div className="custom-tab-1">
                    <Tab.Container defaultActiveKey="Hotel" >
                        <Nav as="ul" className="nav-tabs" style={{ backgroundColor: " var(--rgba-primary-1) " }}>
                            <Nav.Item as="li">
                                <Nav.Link eventKey="Hotel" >
                                    
                                    <span className="nav-name">+ Hotel</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <Nav.Link
                                    eventKey="Entrance"
                                // disabled={qoutationData != "" ? false : true}
                                >
                                   
                                    <span className="nav-name">+ Entrance</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <Nav.Link
                                    eventKey="Transfer"
                                // disabled={qoutationData != "" ? false : true}
                                >
                                   
                                    <span className="nav-name">+ Transfer</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <Nav.Link
                                    eventKey="Transportation"
                                // disabled={qoutationData != "" ? false : true}
                                >
                                   
                                    <span className="nav-name">+ Transportation</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <Nav.Link
                                    eventKey="Activity"
                                // disabled={qoutationData != "" ? false : true}
                                >
                                   
                                    <span className="nav-name">+ Activity</span>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content className="pt-2">
                            <Tab.Pane eventKey="Hotel" className="mt-2">
                               <Hotel/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Entrance">
                                <Entrance/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Transfer">
                            <Transfer/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Transportation">
                            <Transportation/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Activity">
                            <Activity/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>

            </Card.Body>
        </Card >
    )
}

export default Crmrate