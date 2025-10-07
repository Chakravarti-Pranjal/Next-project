import React from 'react'
import { Row,Card,Col,Button,Nav,Container,Dropdown,CardHeader,CardBody,} from "react-bootstrap";
import { Navigate,useNavigate } from 'react-router-dom';
const B2c = () => {
    const Navigates = useNavigate();
    const handledropdownchange = (e) => {
        const value = e.target.value;
        const routes = {
            0: "/query/tourextension",
            1: "/query/tourextension/guest-list/B2c",
            2: "/query/tourextension/guest-list/Employee"
        }
        if (routes[value]) {
            Navigates(routes[value]);
        }
    }
    return (
        <div className=" Guestlist m-0 p-0">
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody className="ms-2">
                            <div className="headingtable  px-1 col-lg-12">
                                <div className="row d-flex border p-1 headingss ">
                                    <div className="col-1">Type</div>
                                    <div className=" col"> Name</div>
                                    <div className=" col"> Address</div>
                                    <div className=" col"> Contact Information </div>
                                    <div className=" col"> Address Proof</div>
                                    <div className=" col"> Passport</div>
                                    <div className=" col">VISA</div>
                                    <div className=" col">Driver License</div>
                                    <div className=" col">Covid Certificate</div>
                                    <div className=" col">Other</div>
                                    <div className=" col">Action</div>
                                </div>
                                <div className="row  border-left border-right border-bottom p-1 text-center columns ">
                                    <div className=" col-1"><div className="mt-2"><input
                                        className=" "
                                        type="checkbox"
                                        value="0"
                                        id="default_no"
                                    /></div></div>
                                    <div className=" my-auto col text-success"><i className="fa-regular fa-pen-to-square"></i> Mr. Nishank Shukla</div>
                                    <div className=" my-auto col"> New Ashok Nagar</div>
                                    <div className=" col"><div className=""><i className="fa-solid fa-square-phone"></i> +91-9595959595</div>  <div className=""><i className="fa-sharp fa-solid fa-envelope"></i> debox@global.com</div>  </div>
                                    <div className="  my-auto col text-danger"> No Attachment</div>
                                    <div className="  my-auto col text-danger"> No Attachment</div>
                                    <div className="  my-auto col text-danger">No Attachment</div>
                                    <div className="  my-auto col text-danger">No Attachment</div>
                                    <div className="  my-auto col text-danger">No Attachment</div>
                                    <div className="  my-auto col text-danger">No Attachment</div>
                                    <div className="  my-auto col text-success">View</div>
                                </div>
                                <div className="row  border-left border-right border-bottom p-1 text-center columns ">
                                    <div className="col-1"><div className="mt-2"><input
                                        className=""
                                        type="checkbox"
                                        value="0"
                                        id="default_no"
                                    /></div></div>
                                    <div className="my-auto col text-success"><i className="fa-regular fa-pen-to-square"></i> Mr. Sanif Khan</div>
                                    <div className="my-auto col"> Noida</div>
                                    <div className=" col"><div className=""><i className="fa-solid fa-square-phone"></i> +91-9595959595</div>  <div className=""><i className="fa-sharp fa-solid fa-envelope"></i> debox@global.com</div>  </div>
                                    <div className="my-auto col text-danger"> No Attachment</div>
                                    <div className="my-auto col text-danger"> No Attachment</div>
                                    <div className="my-auto col text-success">View</div>
                                    <div className="my-auto col text-danger">No Attachment</div>
                                    <div className="my-auto col text-danger">No Attachment</div>
                                    <div className="my-auto col text-danger">No Attachment</div>
                                    <div className="my-auto col text-success">View</div>
                                </div>
                                <div className="row  border-left border-right border-bottom p-1 text-center columns ">
                                    <div className="col-1"><div className="mt-2"><input
                                        className=" "
                                        type="checkbox"
                                        value="0"
                                        id="default_no"
                                    /></div>
                                    </div>
                                    <div className="my-auto col text-success"><i className="fa-regular fa-pen-to-square"></i> Mr. Sanif Khan</div>
                                    <div className="my-auto col"> Noida</div>
                                    <div className=" col"><div className=""><i className="fa-solid fa-square-phone"></i> +91-9595959595</div>  <div className=""><i className="fa-sharp fa-solid fa-envelope"></i> debox@global.com</div>  </div>
                                    <div className="my-auto col text-danger"> No Attachment</div>
                                    <div className="my-auto col text-danger"> No Attachment</div>
                                    <div className="my-auto col text-danger">No Attachment</div>
                                    <div className="my-auto col text-danger">No Attachment</div>
                                    <div className="my-auto col text-danger">No Attachment</div>
                                    <div className="my-auto col text-danger">No Attachment</div>
                                    <div className="my-auto col text-success">View</div>
                                </div>
                                <div className="row  border-left border-right border-bottom p-1 text-center columns ">
                                    <div className="col-1"><div className="mt-2"><input
                                        className=" "
                                        type="checkbox"
                                        value="0"
                                        id="default_no"
                                    /></div>
                                    </div>
                                    <div className="my-auto col text-success"><i className="fa-regular fa-pen-to-square"></i>Mr. Sanif Khan</div>
                                    <div className="my-auto col"> Noida</div>
                                    <div className=" col"><div className=""><i className="fa-solid fa-square-phone"></i> +91-9595959595</div>  <div className=""><i className="fa-sharp fa-solid fa-envelope"></i> debox@global.com</div>  </div>
                                    <div className=" my-auto col text-danger"> No Attachment</div>
                                    <div className=" my-auto col text-danger"> No Attachment</div>
                                    <div className=" my-auto col text-danger">No Attachment</div>
                                    <div className=" my-auto col text-danger">No Attachment</div>
                                    <div className=" my-auto col text-success">View</div>
                                    <div className=" my-auto col text-danger">No Attachment</div>
                                    <div className=" my-auto col text-success">View</div>
                                </div>
                                <div className="row  border-left border-right border-bottom p-1 text-center columns ">
                                    <div className="col-1"><div className="mt-2"><input
                                        className=" "
                                        type="checkbox"
                                        value="0"
                                        id="default_no"
                                    /></div>
                                    </div>
                                    <div className="my-auto col text-success"><i className="fa-regular fa-pen-to-square"></i>Mr. Nishank Shukla</div>
                                    <div className="my-auto col"> New Ashok Nagar</div>
                                    <div className=" col"><div className=""><i className="fa-solid fa-square-phone"></i> +91-9595959595</div>  <div className=""><i className="fa-sharp fa-solid fa-envelope"></i> debox@global.com</div>  </div>
                                    <div className=" my-auto col text-danger"> No Attachment</div>
                                    <div className=" my-auto col text-success">View</div>
                                    <div className=" my-auto col text-danger">No Attachment</div>
                                    <div className=" my-auto col text-danger">No Attachment</div>
                                    <div className=" my-auto col text-danger">No Attachment</div>
                                    <div className=" my-auto col text-danger">No Attachment</div>
                                    <div className=" my-auto col text-success">View</div>
                                </div>
                                <div className="row  border-left border-right border-bottom p-1 text-center columns ">
                                    <div className="col-1"><div className="mt-2"><input
                                        className=" "
                                        type="checkbox"
                                        value="0"
                                        id="default_no"
                                    /></div>
                                    </div>
                                    <div className="my-auto col text-success"><i className="fa-regular fa-pen-to-square"></i>Mr. Nishank Shukla</div>
                                    <div className="my-auto col"> New Ashok Nagar</div>
                                    <div className=" col"><div className=""><i className="fa-solid fa-square-phone"></i> +91-9595959595</div>  <div className=""><i className="fa-sharp fa-solid fa-envelope"></i> debox@global.com</div>  </div>
                                    <div className=" my-auto col text-danger"> No Attachment</div>
                                    <div className=" my-auto col text-danger"> No Attachment</div>
                                    <div className=" my-auto col text-danger">No Attachment</div>
                                    <div className=" my-auto col text-danger">No Attachment</div>
                                    <div className=" my-auto col text-danger">No Attachment</div>
                                    <div className=" my-auto col text-danger">No Attachment</div>
                                    <div className=" my-auto col text-success">View</div>
                                </div>

                            </div>
                            <div className="mt-2">
                                <p>Showing 1 to 4 of 25 entries</p>
                                <div className="col-3">
                                    <div className="row">
                                        <div className="fw-600 col-3 my-auto">35 entries</div><div className="col-6"><select
                                            className="form-control form-control-sm col-4  "
                                        > <option value="1">25 Records Per Page</option>
                                        </select></div></div>
                                </div>


                            </div>

                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default B2c

