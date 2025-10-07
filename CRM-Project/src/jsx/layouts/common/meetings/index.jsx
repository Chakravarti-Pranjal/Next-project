import React,{useState,useEffect} from 'react';
import { Row, Card, Col, Button, Nav, Container, Dropdown, } from "react-bootstrap";
import { axiosOther } from '../../../../http/axios_base_url';
import "../../../../scss/main.css"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Table from 'react-bootstrap/Table';

 const Meetings = ({partner_payload}) => {
    console.log(partner_payload)
    const navigate = useNavigate();
    const param = useParams();
    const [meetingslist, setMeetingslist] = useState([]);
    const getDataToServer = async () => {
        try {
            const response = await axiosOther.post("meetingslist", {
                Fk_partnerid: partner_payload?.Fk_partnerid,
                Type: partner_payload?.Type,
            });
            setMeetingslist(response.data.DataList);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(()=>{
        getDataToServer()
    },[])
    const handleAddMeeting=()=>{
        navigate(`/add/meeting/${param?.id}`,{state:{partner_payload}})
    }
    const handleEditData=(data)=>{
        navigate(`/add/meeting/${param?.id}`,{state:data})
    }
    const handleDeleteData = async (id) => {
        const { data } = await axiosOther.post("destroymeetings", {
          id: id,
        });
        if (data?.Status === 1) {
          toast.success(data?.Message);
          getDataToServer();
        }
      };

  return (
    <>
    <Row>
    <Col md={12}>
           <Card>
                        <Card.Header>
                            <Card.Title className='d-flex justify-content-between'>
                            Meeting
                            
                            </Card.Title>
                            <button className="btn btn-primary btn-custom-size" onClick={handleAddMeeting}>
                                Add Meeting
                            </button>
                        </Card.Header>
                        <Card.Body>

                            <Table responsive striped bordered >
                                <thead >
                                    <tr>

                                        <th scope="col">
                                            Meeting Agenda</th>
                                        <th scope="col">Start Date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Meeting Outcome</th>
                                        <th scope="col">Sales Person</th>
                                        <th scope="col">Created Date</th>
                                        <th scope="col">Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {meetingslist && meetingslist?.length > 0 && meetingslist.map((item,index) => (
                                        <tr key={item.id}>
                                            <td>
                                                <strong>{index+1}</strong>
                                            </td>
                                            <td>{item?.Startdate}</td>
                                            <td>{item?.MeetingStatus}</td>
                                            <td>{item?.MeetingOutcome}</td>
                                            <td>{item?.AgentName}</td>
                                            <td>{item?.Startdate}</td>
                                           
                                           
                                            <td>
                                            <span className="d-flex gap-2 justify-content-center">
                                <i
                                  className="fa-solid fa-pencil cursor-pointer action-icon text-success"
                                  onClick={()=>handleEditData(item)}

                                ></i>
                                <i
                                  className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
                                  onClick={()=>handleDeleteData(item?.id)}
                                ></i>
                              </span>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>



                </Col>
                </Row>
    </>
  )
}
export default React.memo(Meetings);
