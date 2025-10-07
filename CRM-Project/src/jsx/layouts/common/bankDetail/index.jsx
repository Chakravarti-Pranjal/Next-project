import React,{useState,useEffect} from 'react';
import { Row, Card, Col, Button, Nav, Container, Dropdown, } from "react-bootstrap";
import { axiosOther } from '../../../../http/axios_base_url';
import ".././../../../scss/main.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Table from 'react-bootstrap/Table';

 const BankDetail = ({partner_payload}) => {
    const [contactlist, setContactlist] = useState([]);
    const [bankdetailslist, setBankdetailslist] = useState([]);
    const param = useParams();
    const getDataToServer = async () => {
        try {
            const response = await axiosOther.post("bankdetailslist", {
                Fk_partnerid: param?.id,
                Type: partner_payload?.Type
            });
            setBankdetailslist(response.data.DataList);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(()=>{
        getDataToServer()
    },[])
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
    const handleEditData=(data)=>{
        navigate(`/add/bank/${param?.id}`,{state:data})
    }
    const handleDeleteData = async (id) => {
        const { data } = await axiosOther.post("destroybankdetails", {
          id: id,
        });
        if (data?.Status === 1) {
          toast.success(data?.Message);
          getDataToServer();
        }
      };
      const navigate=useNavigate();
      const handleAdd = ()=>{
        navigate(`/add/bank/${param?.id}`,{state:{partner_payload}})
      }
  return (
    <>
    <Row>
    
    <Col lg={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title className='d-flex justify-content-between'>
                           Bank Detail
                            
                            </Card.Title>
                            <button className="btn btn-primary btn-custom-size" onClick={handleAdd}>
                                Add Bank Detail
                            </button>
                        </Card.Header>
                        <Card.Body>

                            <Table responsive striped bordered >
                                <thead >
                                    <tr>

                                        <th scope="col">
                                            Sr</th>
                                        <th scope="col">Bank Name</th>
                                        <th scope="col">Branch Name</th>
                                        <th scope="col">Benificiry</th>
                                        <th scope="col">IFSC Code</th>
                                        <th scope="col">PHONE</th>
                                        <th scope="col">Email Id</th>
                                        <th scope="col">Swift Code</th>
                                        <th scope="col">Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {bankdetailslist && bankdetailslist?.length > 0 && bankdetailslist.map((item,ind) => (
                                        <tr key={item?.id}>
                                            <td>
                                                <strong>{ind+1}</strong>
                                            </td>
                                            <td>{item?.BankName}</td>
                                            <td>{item?.BankBranch}</td>
                                            <td>{item?.BenificiryName}</td>
                                            <td>{item?.IfscCode}</td>
                                            <td>{item?.PhoneNumber}</td>
                                            <td>{item?.EmailId}</td>

                                            <td>
                                                {item?.SwiftCode}
                                            </td>
                                           
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
export default React.memo(BankDetail);
