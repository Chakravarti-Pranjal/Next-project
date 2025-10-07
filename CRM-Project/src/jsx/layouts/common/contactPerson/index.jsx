import React, { useState, useEffect } from "react";
import { Row, Card, Col } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import ".././../../../scss/main.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { notifySuccess } from "../../../../helper/notify";
import { ToastContainer } from "react-toastify";

const ContactPerson = ({ partner_payload }) => {
  const param = useParams();
  const [contactlist, setContactlist] = useState([]);
  const location = useLocation();
  const segments = location.pathname.split("/");
  const middle = segments[2];
  // console.log(middle, "middle");
  const getDataToServer = async () => {
    try {
      const response = await axiosOther.post("contactlist", {
        ParentId: param?.id,
        Type: middle === "supplier" ? "Supplier" : "Agent",
      });

      setContactlist(response.data.DataList);
      // console.log(response, "111");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getDataToServer();
  }, []);

  const navigate = useNavigate();

  const handleAdd = () => {

    navigate(`/add/contact/${param?.id}`, {
      state: { partner_payload, typeName: middle },
    });
  };

  const handleEditData = (data) => {
    navigate(`/add/contact/${param?.id}`, {
      state: { data, typeName: middle },
    });
  };

  const handleDeleteData = async (id) => {
    const confirmation = await swal({
      title: "Are you sure want to Delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    try {
      const { data } = await axiosOther.post("destroycontact", { id: id });
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
        <Col lg={12}>
          <ToastContainer />
          <Card>
            <Card.Header>
              <Card.Title className="d-flex justify-content-between">
                Contact Person
              </Card.Title>
              <button
                className="btn btn-primary btn-custom-size"
                onClick={handleAdd}
              >
                Add Contact Person
              </button>
            </Card.Header>
            <Card.Body>
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    <th scope="col">Sr</th>
                    <th scope="col">Office Type</th>
                    <th scope="col">Contact person</th>
                    <th scope="col">Designation</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Mobile</th>
                    <th scope="col">Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">Image 1</th>
                    <th scope="col">Image 2</th>
                    <th scope="col">Image 3</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contactlist &&
                    contactlist?.length > 0 &&
                    contactlist.map((item, index) => (
                      <tr key={item?.id}>
                        <td>
                          <strong>{index + 1}</strong>
                        </td>
                        <td>{item?.OfficeName}</td>
                        <td>
                          {item?.FirstName} {item?.LastName}
                        </td>
                        <td>{item?.Designation}</td>
                        {/* <td>{item?.CountryCode}</td> */}
                        <td>
                          {/* {item?.CountryCode}  */}
                          {item?.Phone}
                        </td>
                        <td>{item?.MobileNo}</td>
                        <td>
                          {item?.Email} {item?.AlternateEmail}
                        </td>

                        <td>{item?.Status}</td>

                        <td>
                          {
                            !(item?.ImageNameOne == "") ? <a
                              href={item?.ImageNameOne}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a> : ""
                          }


                        </td>
                        <td>
                          {
                            !(item?.ImageNameTwo == "") ? <a
                              href={item?.ImageNameTwo}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a> : ""
                          }


                        </td>
                        <td>
                          {/* <a
                            href={item?.ImageNameThree}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a> */}
                          {
                            !(item?.ImageNameThree == "") ? <a
                              href={item?.ImageNameThree}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a> : ""
                          }
                        </td>
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
  );
};
export default React.memo(ContactPerson);
