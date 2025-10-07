import React,{useState,useEffect} from 'react';
import { Row, Card, Col, Button, Nav, Container, Dropdown, } from "react-bootstrap";
import { axiosOther } from '../../../../http/axios_base_url';
import "../../../../scss/main.css"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Table from 'react-bootstrap/Table';

 const Call = ({partner_payload}) => {
    const navigate = useNavigate();
    const param = useParams();
    const [officelist, setOfficelist] = useState([]);
    const getDataToServer = async () => {
        try {
            const response = await axiosOther.post("callslist", {
                Fk_partnerid: partner_payload?.Fk_partnerid,
                Type: partner_payload?.Type,
            });
            setOfficelist(response.data.DataList);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(()=>{
        getDataToServer()
    },[])
    const handleAddOffice=()=>{
        navigate(`/add/call/${param?.id}`,{state:{partner_payload}})
    }
    const handleEditData=(data)=>{
        navigate(`/add/call/${param?.id}`,{state:data})
    }
    const handleDeleteData = async (id) => {
        const { data } = await axiosOther.post("destroycalls", {
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
                           Calls
                            
                            </Card.Title>
                            <button className="btn btn-primary btn-custom-size" onClick={handleAddOffice}>
                                Add Call
                            </button>
                        </Card.Header>
                        <Card.Body>

                            <Table responsive striped bordered >
                                <thead >
                                    <tr>
                                        <th scope="col">Call Subject</th>
                                        <th scope="col">Start Date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Call Type</th>
                                        <th scope="col">Sales Person</th>
                                        <th scope="col">Created Date</th>
                                        <th scope="col">Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {officelist && officelist?.length > 0 && officelist.map((item,inex) => (
                                        <tr key={inex+1}>
                                
                                            <td>{item?.CallAgenda}</td>
                                            <td>{item?.Startdate}</td>
                                            <td>{item?.CallStatus}</td>
                                            <td>{item?.CallType}</td>
                                            <td>{item?.SalesPerson}</td>
                                            <td>{item?.Startdate}</td>
                                            {/* <td>
                                                {item?.Address}
                                            </td> */}
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
export default React.memo(Call);
