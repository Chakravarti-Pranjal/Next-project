import React,{useState,useEffect} from 'react';
import { Row, Card, Col, Button, Nav, Container, Dropdown, } from "react-bootstrap";
import { axiosOther } from '../../../../http/axios_base_url';
import "../../../../scss/main.css"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Table from 'react-bootstrap/Table';

 const Task = ({partner_payload}) => {
    const navigate = useNavigate();
    const param = useParams();
    const [tasklist, setTasklist] = useState([]);
    const getDataToServer = async () => {
        try {
            const response = await axiosOther.post("taskslist", {
                Fk_partnerid: partner_payload?.Fk_partnerid,
                Type: partner_payload?.Type,
            });
            setTasklist(response.data.DataList);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(()=>{
        getDataToServer()
    },[])
    const handleAddOffice=()=>{
        navigate(`/add/task/${param?.id}`,{state:{partner_payload}})
    }
    const handleEditData=(data)=>{
        navigate(`/add/task/${param?.id}`,{state:data})
    }
    const handleDeleteData = async (id) => {
        const { data } = await axiosOther.post("destroytasks", {
          id: id,
        });
        if (data?.Status === 1) {
          toast.success(data?.Message);
          getDataToServer();
        }
      };
    const svg1 = (
        <svg width="20px" height="20px" viewBox="0 0 24 24" version="1.1">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <rect x="0" y="0" width="24" height="24"></rect>
                <circle fill="#000000" cx="5" cy="12" r="2"></circle>
                <circle fill="#000000" cx="12" cy="12" r="2"></circle>
                <circle fill="#000000" cx="19" cy="12" r="2"></circle>
            </g>
        </svg>
    );
  return (
    <>
    <Row>
    <Col md={12}>
           <Card>
                        <Card.Header>
                            <Card.Title className='d-flex justify-content-between'>
                           Task
                            
                            </Card.Title>
                            <button className="btn btn-primary btn-custom-size" onClick={handleAddOffice}>
                                Add Task
                            </button>
                        </Card.Header>
                        <Card.Body>

                            <Table responsive striped bordered >
                                <thead >
                                    <tr>

                                        
                                        <th scope="col">Subject</th>
                                        <th scope="col">Start Date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Sales Person</th>
                                        <th scope="col">Created At</th>
                                        
                                        <th scope="col">Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {tasklist && tasklist?.length > 0 && tasklist.map((item) => (
                                        <tr key={item.id}>
                                           
                                            <td>{item?.TaskSubject}</td>
                                            <td>{item?.Startdate}</td>
                                            <td>{item?.TaskStatus}</td>
                                            <td>{item?.SalesPerson}</td>
                                            <td>{item?.Startdate}</td>
                                            
                                            
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        variant="danger"
                                                        className="light sharp i-false"
                                                    >
                                                        {svg1}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={()=>handleEditData(item)}>Edit</Dropdown.Item>
                                                        <Dropdown.Item onClick={()=>handleDeleteData(item?.id)}>Delete</Dropdown.Item>
                                                        
                                                    </Dropdown.Menu>
                                                </Dropdown>
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
export default React.memo(Task);
