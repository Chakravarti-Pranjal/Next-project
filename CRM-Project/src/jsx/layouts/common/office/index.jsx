import React, { useState, useEffect } from 'react';
import { Row, Card, Col, Button, Nav, Container, Dropdown } from "react-bootstrap";
import { axiosOther } from '../../../../http/axios_base_url';
import "../../../../scss/main.css"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { notifySuccess } from '../../../../helper/notify';
import { ToastContainer } from 'react-toastify';

const Office = ({ partner_payload }) => {
    const navigate = useNavigate();
    const param = useParams();
    const [officelist, setOfficelist] = useState([]);
    const getDataToServer = async () => {
        //  console.log(partner_payload?.Fk_partnerid, partner_payload?.Type, "type")
        try {
            const response = await axiosOther.post("officelist", {
                Fk_partnerid: partner_payload?.Fk_partnerid,
                type: partner_payload?.Type,
            });
            setOfficelist(response.data.DataList);
            console.log(response.data.DataList, "datalist")
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        getDataToServer()
    }, [])
    // console.log(partner_payload, "partner_payload")
    const handleAddOffice = () => {
        navigate(`/add/office/${param?.id}`, { state: { partner_payload } })
    }
    const handleEditData = (data) => {
        console.log(data, "data")
        navigate(`/add/office/${param?.id}`, { state: data })
    }
    const handleDeleteData = async (id) => {
        const confirmation = await swal({
            title: "Are you sure want to Delete?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });
        try {
            const { data } = await axiosOther.post("destroyoffice", { id: id });
            if (data?.Status == 1 || data?.status == 1) {
                notifySuccess(data?.Message || data?.message || data?.result);
                getDataToServer();
            }
        } catch (err) {
            if (err) {
                alert(err?.message || err?.Message);
            }
        }

    };


    return (
        <>
            <Row>
                <Col md={12}>
                    <ToastContainer />
                    <Card>
                        <Card.Header>
                            <Card.Title className='d-flex justify-content-between'>
                                Office
                            </Card.Title>
                            <button className="btn btn-primary btn-custom-size" onClick={handleAddOffice}>
                                Add Office
                            </button>
                        </Card.Header>
                        <Card.Body>

                            <Table responsive striped bordered >
                                <thead >
                                    <tr>

                                        <th scope="col">
                                            Sr</th>
                                        <th scope="col">Office Type</th>
                                        <th scope="col">Country</th>
                                        <th scope='col'>City</th>
                                        <th scope="col">Zip code</th>
                                        <th scope="col">GSTN</th>
                                        <th scope="col">PAN No</th>
                                        <th scope="col">Address</th>
                                        <th scope="col">Action</th>

                                    </tr>
                                </thead>
                                <tbody>

                                    {officelist && officelist?.length > 0 && officelist.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>
                                                <strong>{index + 1}</strong>
                                            </td>
                                            <td>{item?.Name ?? "No Record"}</td>
                                            <td>{item?.CountryName ?? "No Record"}</td>
                                            <td>{item?.CityName}</td>
                                            <td>{item?.PinCode ?? "No Record"}</td>
                                            <td>{item?.Gstn ?? "No Record"}</td>

                                            <td>{item?.Pan ?? "No Record"}</td>
                                            <td>
                                                {item?.Address ?? "No Record"}
                                            </td>
                                            {console.log(item, "item")}

                                            <td>

                                                <span className="d-flex gap-2 justify-content-center">
                                                    <i
                                                        className="fa-solid fa-pencil cursor-pointer action-icon text-success"
                                                        onClick={() => handleEditData(item)}

                                                    ></i>
                                                    <i
                                                        className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
                                                        onClick={() => handleDeleteData(item?.id)}
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
export default React.memo(Office);
