import React,{ useState,useEffect,useCallback } from 'react';
import { Row,Card,Col,Button,Nav,Container,Dropdown,} from "react-bootstrap";
import { axiosOther } from '../../../../http/axios_base_url';
import ".././../../../scss/main.css";
import { Link,Navigate,useLocation,useNavigate,useParams } from "react-router-dom";
import Table from 'react-bootstrap/Table';

const CompanyDocument = ({ partner_payload }) => {
  const [contactlist,setContactlist] = useState([]);
  const [companydocumentlist,setCompanydocumentlist] = useState([]);
  console.log(partner_payload,"11")
  const getDataToServer = async () => {
    try {
      const response = await axiosOther.post("companydocumentlist",{
        Fk_partnerid: param?.id,
        Type: partner_payload?.Type
      });
      setCompanydocumentlist(response.data.DataList);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getDataToServer()
  },[])
  // const handleDeleteData = async (id) => {
  //     const { data } = await axiosOther.post("destroycompanydocument", {
  //       id: id,
  //     });
  //     if (data?.Status === 1) {
  //       toast.success(data?.Message);
  //       getDataToServer();
  //     }
  //   };

  const handleDeleteData = useCallback(async (id) => {
    const confirmation = await swal({
      title: "Are you sure you want to delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmation) {
      try {
        const { data } = await axiosOther.post("destroycompanydocument",{ id });

        if (data?.Status === 1 || data?.status === 1) {
          toast.success(data?.Message);
          getDataToServer(); // Refresh the data
        }
      } catch (err) {
        toast.error(err?.message || err?.Message);
      }
    }
  },[]);
  const navigate = useNavigate();
  const param = useParams();

  const handleEditData = (data) => {
    console.log("Navigating with:", param?.id, partner_payload, data); // Debugging

    navigate(`/add/document/${param?.id}`, { 
        state: { 
            partner_payload, // ✅ Include partner_payload
            data // ✅ Include existing data
        } 
    });
};
  const handleAdd = () => {
    navigate(`/add/document/${param?.id}`,{ state: { partner_payload } })
  }



  return (
    <>
      <Row>

        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title className='d-flex justify-content-between'>
                Company Document

              </Card.Title>
              <button className="btn btn-primary btn-custom-size" onClick={handleAdd}>
                Add Document
              </button>
            </Card.Header>
            <Card.Body>

              <Table responsive striped bordered >
                <thead >
                  <tr>

                    <th scope="col">
                      Sr</th>
                    <th scope="col">Document Name</th>
                    <th scope="col">Document Number</th>
                    <th scope="col">Issue Date</th>
                    <th scope="col">Expire Date</th>
                    <th scope="col">Document</th>


                  </tr>
                </thead>
                <tbody>
                  {companydocumentlist && companydocumentlist?.length > 0 && companydocumentlist.map((item,index) => (
                    <tr key={item?.id}>
                      <td>
                        <strong>{index + 1}</strong>
                      </td>
                      <td>{item?.DocumentName}</td>
                      <td>{item?.DocumentNumber}</td>
                      <td>{item?.IssueDate}</td>
                      <td>{item?.ExpireDate}</td>
                      <td>
                        {item?.DocumentImageName ? (
                          <img
                            src={`${item.DocumentImageName}`}
                            // alt="Document"
                            style={{ width: "30px",height: "30px" }} // Adjust size as needed
                          />
                        ) : (
                          "No Image"
                        )}
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
  )
}
export default React.memo(CompanyDocument);
