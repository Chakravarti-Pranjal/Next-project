import moment from 'moment';
import React, { useState } from 'react'
import { Row, Col, Card, Accordion } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import MailReply from './mailReply';
import useQueryData from '../../../hooks/custom_hooks/useQueryData';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";



const ClientCommunication = () => {
  const [showReply, setShowReply] = useState(false)
  const queryData = useQueryData()
  const navigate = useNavigate();
  const handleReply = () => {
    setShowReply(true)
  }
  const defaultAccordion = [
    {
      title: "Dear Sir,Greetings from DeBox services! Thanks for the writing to us.We are working an...",
      text:
        "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.",
      bg: "primary",

    },

  ];
  const handlerQuery = () => {
    const storedUser = localStorage.getItem("Query_Qoutation");
    const final = JSON.parse(storedUser);
    console.log(final, "final")

    if (
      final &&
      final.QoutationNum &&
      final.QoutationNum.includes("Final") &&
      final.QueryID
    ) {
      // navigate to desired route
      navigate("/query/supplier-communication");
    } else {
      const confirmation = swal({
        title: `Query is not confirmed?`,
        icon: "warning",
        buttons: {
          confirm: {
            text: "Ok",
            value: true,
            visible: true,
            className: "btn-custom-size btn btn-primary",
            closeModal: true,
          },
          cancel: {
            text: "Cancel",
            value: false,
            visible: true,
            className: "btn-custom-size btn light btn-primary",
            closeModal: true,
          },
        },
        dangerMode: true,
      });
    }
  };
  return (
    <>
      <div className="row client-communication">
        <Col xl="12">
          {showReply &&
            <MailReply />
          }

          <Card className="transparent-card">
            <Card.Header className="d-flex justify-content-between py-2 me-2" style={{ backgroundColor: " var(--rgba-primary-1) " }}>
              <Card.Title>Query Confirmed</Card.Title>
              <div className="d-flex align-items-center gap-2">
                <button type="submit" className="btn btn-primary btn-custom-size" onClick={handleReply}>
                  Reply</button>
                <button
                  className="btn btn-dark btn-custom-size "
                  onClick={() => navigate(-1)}
                >
                  <span className="me-1">Back</span>
                  <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                </button>
                <button
                  className="btn btn-primary btn-custom-size "
                  name="SaveButton"
                  // onClick={() => navigate("/query/supplier-communication")}
                  onClick={handlerQuery}
                >
                  <span className="me-1">Next</span>
                  <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
                </button>
              </div>
            </Card.Header>
            <Card.Body px={1}>
              <Accordion className="accordion accordion-header-shadow accordion-rounded" defaultActiveKey="1">
                {defaultAccordion.map((d, i) => (
                  <Accordion.Item className="accordion-item" key={i} eventKey={i.toString()}>
                    <Accordion.Header className="accordion-header accordion-header--primary  d-flex  gap-2 justify-content-start font-size10">
                      <span className="accordion-header-icon m-1"><i class="fa-solid fa-reply text-primary" ></i></span>
                      <span className="accordion-header-text  font-size10">{d.title}</span>
                      <span className="accordion-header-text fs-12" >
                        <i class="fa-solid fa-circle mx-1 text-secondary " style={{ fontSize: '0.5rem' }} ></i>
                        {moment().format(' h:mm a - DD-MM-YYYY')}
                      </span>
                      {/* <span className="accordion-header-indicator"></span> */}
                    </Accordion.Header>
                    <Accordion.Collapse eventKey={i.toString()} className="accordion__body p-1">
                      <div className="accordion-body px-1">
                        <div className='container-fluid m-0 p-1'>
                          <div className='row'>
                            <div className='col-lg-3 col-md-6 col-sm-6 '>
                              <div className='card email-column p-2 innerCard'>

                                <label className='font-w500 py-1' style={{ background: '#efefef' }}> <i class="fa-solid fa-envelope text-primary"></i> CLIENT:</label>
                                <p className='m-0 font-size10'> nitin.kumboj@gmail.com</p></div>

                            </div>
                            <div className='col-lg-3 col-md-6 col-sm-6 '>
                              <div className='card email-column p-2 innerCard'>
                                <label className='font-w500 py-1' style={{ background: '#efefef' }}> <i class="fa-solid fa-envelope text-primary"></i> OPERATION PERSON:</label>
                                <p className='m-0 font-size10'> nitin.kumboj@gmail.com</p></div>

                            </div>
                            <div className='col-lg-3 col-md-6 col-sm-6 '>
                              <div className='card email-column p-2 innerCard'>
                                <label className='font-w500 py-1' style={{ background: '#efefef' }}> <i class="fa-solid fa-envelope text-primary"></i> SALES PERSON:</label>
                                <p className='m-0 font-size10'> nitin.kumboj@gmail.com</p></div>

                            </div>
                            <div className='col-lg-3 col-md-6 col-sm-6'>
                              <div className='card email-column p-2 innerCard'>
                                <label className='font-w500 py-1' style={{ background: '#efefef' }}> <i class="fa-solid fa-envelope text-primary"></i> GROUP:</label>
                                <p className='m-0 font-size10'> </p></div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-12'>
                              <p className='font-size10'>
                                Dear Sir,
                                <br>
                                </br>
                                Greetings from DeBox services!
                                <br></br>
                                Thanks for the writing to us.
                                <br></br>
                                We are working on your request and will provide you details shortly, till then kindly bear with us.
                              </p>
                            </div>
                            <div className='col-12'>
                              <div className='p-0 border-1 border-grey'>
                                <p className='bg-grey px-2 font-w500 font-size-12'>Query Id #DB24-25/002341</p>
                                <Table responsive striped bordered>
                                  <thead >
                                    <tr >
                                      <th scope="col" className="font-size-12 ">
                                        <strong>Query Generated Date</strong>
                                      </th>
                                      <th scope="col" className="font-size-12 ">
                                        <strong>Subject</strong>
                                      </th>
                                      <th scope="col" className="font-size-12">
                                        <strong>Adult</strong>
                                      </th>
                                      <th scope="col" className="font-size-12">
                                        <strong>Child</strong>
                                      </th>

                                    </tr>
                                  </thead>
                                  <tbody>
                                    {/* {modalTableList?.length>0 ? modalTableList?.map((data,index)=>{
                    return (
                        <tr key={index}>
                        <td className="font-size10">{index+1}</td>
                        <td className="font-size10">{moment(data?.Restriction?.FromDate).format('DD-MM-YYYY')}-{moment(data?.Restriction?.FromDate).format('DD-MM-YYYY')}</td>
                        <td className="font-size10">{data?.Restriction?.Reason}</td>
                        <td className="font-size10"><span className="d-flex gap-1">
                                <i
                                  className="fa-solid fa-pencil cursor-pointer action-icon text-success"
                                  data-toggle="modal"
                                  data-target="#modal_form_vertical"
                                  onClick={() =>
                                    handleTableEdit(data)
                                  }
                                ></i>
                                <i
                                  className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
                                  onClick={() =>
                                    handleDelete(
                                      data?.Id
                                    )
                                  }
                                ></i>
                              </span></td>
                    </tr>
                    )
                   
                })
                :(
                    <div className="text-center mt-3 d-flex justify-content-center">No record found</div>
                )} */}

                                  </tbody>
                                </Table>
                                <p className='bg-grey px-2 font-w500 font-size-12' >Destinations</p>
                                <Table responsive striped bordered>
                                  <thead >
                                    <tr >
                                      <th scope="col" className="font-size-12 ">
                                        <strong>S.N.</strong>
                                      </th>
                                      <th scope="col" className="font-size-12 ">
                                        <strong>Date</strong>
                                      </th>
                                      <th scope="col" className="font-size-12">
                                        <strong>Destination</strong>
                                      </th>


                                    </tr>
                                  </thead>
                                  <tbody>
                                    {/* {modalTableList?.length>0 ? modalTableList?.map((data,index)=>{
                    return (
                        <tr key={index}>
                        <td className="font-size10">{index+1}</td>
                        <td className="font-size10">{moment(data?.Restriction?.FromDate).format('DD-MM-YYYY')}-{moment(data?.Restriction?.FromDate).format('DD-MM-YYYY')}</td>
                        <td className="font-size10">{data?.Restriction?.Reason}</td>
                        <td className="font-size10"><span className="d-flex gap-1">
                                <i
                                  className="fa-solid fa-pencil cursor-pointer action-icon text-success"
                                  data-toggle="modal"
                                  data-target="#modal_form_vertical"
                                  onClick={() =>
                                    handleTableEdit(data)
                                  }
                                ></i>
                                <i
                                  className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
                                  onClick={() =>
                                    handleDelete(
                                      data?.Id
                                    )
                                  }
                                ></i>
                              </span></td>
                    </tr>
                    )
                   
                })
                :(
                    <div className="text-center mt-3 d-flex justify-content-center">No record found</div>
                )} */}

                                  </tbody>
                                </Table>

                              </div>
                            </div>

                          </div>

                        </div>
                      </div>
                    </Accordion.Collapse>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
      </div>
    </>
  )
}

export default ClientCommunication