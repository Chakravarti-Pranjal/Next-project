import React, { useState, useEffect } from "react";
import {
  Row,
  Card,
  Col,
  Button,
  Nav,
  Container,
  Dropdown,
} from "react-bootstrap";
import { axiosOther } from "../../../../../http/axios_base_url";
import "../../../../../scss/main.css";
import { useNavigate, useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifyError, notifySuccess } from "../../../../../helper/notify";
import { Modal } from 'react-bootstrap';

const RateList = ({
  id,
  setDataUpdate,
  setIsUpdating,
  rateInitialList,
  rateList,
}) => {
  const [centered, setcentered] = useState(false);
  const [Dataview, setDataview] = useState([]);
  const handleRateDelete = async (primId, uniqId) => {
    try {
      const { data } = await axiosOther.post("deleteactivityrate", {
        ActivityId: primId,
        UniqueId: uniqId,
      });

      if (data?.status == 1 || data?.Status == 1) {
        rateList();
        notifySuccess(data?.Message || data?.message);
      }

      if (data?.status == 0 || data?.Status == 0) {
        notifyError(data?.Message || data?.message);
      }
    } catch (err) {
      notifyError(err.message);
    }
  };

  const handleRateEdit = (value, companyId, ServiceCost) => {
    // console.log(value, "value")
    setIsUpdating(true);
    const Servicect = value?.ServiceCost?.[0]
    setDataUpdate({
      ...value,
      RateUniqueId: value?.UniqueID,
      CompanyId: companyId,
      SupplierId: value?.SupplierId,
      CurrencyId: value?.CurrencyId,
      Service: value?.Name,
      UpToPax: Servicect?.UpToPax || "",
      Rounds: value?.ServiceCosts?.Rounds || "",
      Remarks: value?.ServiceCosts?.Remarks || "",
      Duration: value?.ServiceCosts?.Duration || "",
      Class: value?.ServiceCosts?.Class || "",
      Amount: value?.ServiceCosts?.Amount || "",


      ValidTo: value?.ValidTo,
      ValidFrom: value?.ValidFrom,
      DestinationID: value?.DestinatinoId,
      Status: value?.Status,

      TaxSlabId: value?.TaxSlabId,

      AddedBy: value?.AddedBy,
      UpdatedBy: value?.UpdatedBy,
      AddedDate: value?.AddedDate,
      UpdatedDate: value?.UpdatedDate,

    });
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

  // const view = async (item) => {
  //   console.log(item);
  //   try {
  //     if (!item.ServiceCost || item.ServiceCost.length === 0) {
  //       alert("No ServiceCost available.");
  //       return;
  //     }

  //     const popupDiv = document.createElement("div");
  //     Object.assign(popupDiv.style, {
  //       position: "fixed",
  //       top: "50%",
  //       left: "50%",
  //       transform: "translate(-50%, -50%)",
  //       width: "50%",
  //       height: "50%",
  //       minheight:"40px",
  //       zIndex: 1000,
  //       display: "flex",
  //       alignItems: "center",
  //       justifyContent: "center",
  //       borderRadius: "10px",
  //       padding: "10px",

  //     });

  //     const contentDiv = document.createElement("div");
  //     Object.assign(contentDiv.style, {
  //       width: "100%",
  //       height: "100%",
  //       borderRadius: "10px",
  //       overflow: "auto",
  //       color: "black",
  //       padding: "15px",
  //       display: "flex",
  //       flexDirection: "column",
  //       justifyContent: "start",
  //       alignItems: "center",
  //       backgroundColor: "rgba(0, 0, 0, 0.8)",
  //     });

  //     let tableHTML = `
  //       <table border="1" style="border-collapse: collapse; width: 100%; font-size: 14px; text-align: center;">
  //         <thead>
  //           <tr style="background-color: #f5f5f5;  color: black;">
  //             <th style="padding: 5px; border: 1px solid black;">UpToPax</th>
  //             <th style="padding: 5px; border: 1px solid black;">Rounds</th>
  //             <th style="padding: 5px; border: 1px solid black;">Class</th>
  //             <th style="padding: 5px; border: 1px solid black;">Duration</th>
  //             <th style="padding: 5px; border: 1px solid black;">Amount</th>
  //             <th style="padding: 5px; border: 1px solid black;">Remarks</th>
  //           </tr>
  //         </thead>
  //         <tbody>`;

  //     // Loop through each ServiceCost and create a row
  //     item.ServiceCost.forEach((dest) => {
  //       tableHTML += `
  //         <tr style="background-color: white; color: black;">
  //           <td style="padding: 5px; border: 1px solid black;">${dest.UpToPax || "-"}</td>
  //           <td style="padding: 5px; border: 1px solid black;">${dest.Rounds || "-"}</td>
  //           <td style="padding: 5px; border: 1px solid black;">${dest.Class || "-"}</td>
  //           <td style="padding: 5px; border: 1px solid black;">${dest.Duration || "-"}</td>
  //           <td style="padding: 5px; border: 1px solid black;">${dest.Amount || "-"}</td>
  //           <td style="padding: 5px; border: 1px solid black;">${dest.Remarks || "-"}</td>
  //         </tr>`;
  //     });

  //     tableHTML += `</tbody></table>`;
  //     contentDiv.innerHTML = tableHTML;

  //     const closeButton = document.createElement("div");
  //     closeButton.innerHTML = "×";
  //     Object.assign(closeButton.style, {
  //       position: "absolute",
  //       top: "10px",
  //       right: "15px",
  //       fontSize: "18px",
  //       fontWeight: "bold",
  //       color: "#bd241a",
  //       cursor: "pointer",
  //     });

  //     closeButton.onclick = () => {
  //       document.body.style.overflow = "auto";
  //       document.body.removeChild(popupDiv);
  //     };

  //     popupDiv.appendChild(contentDiv);
  //     popupDiv.appendChild(closeButton);
  //     document.body.appendChild(popupDiv);
  //     document.body.style.overflow = "hidden";
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //     alert("Failed to generate the template. Please try again later.");
  //   }
  // };

  const view = (item) => {
    setcentered(true)
    setDataview(item.ServiceCost)
    // console.log(item.ServiceCost, "item.ServiceCost")
  };


  return (
    <>
      <Modal show={centered} onHide={() => setcentered(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Activity Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Dataview.length > 0 ? (
            <Table striped bordered responsive>
              <thead>
                <tr>
                  <th>UpToPax</th>
                  <th>Rounds</th>
                  <th>Class</th>
                  <th>Duration</th>
                  <th>Amount</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {Dataview.map((dest, index) => (
                  <tr key={index}>
                    <td>{dest.UpToPax || "-"}</td>
                    <td>{dest.Rounds || "-"}</td>
                    <td>{dest.Class || "-"}</td>
                    <td>{dest.Duration || "-"}</td>
                    <td>{dest.Amount || "-"}</td>
                    <td>{dest.Remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">No records found!</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setcentered(false)}
            variant="danger light"
            className="btn-custom-size"
          >
            Close
          </Button>
          {/* <Button variant="primary" className="btn-custom-size">
            Save
          </Button> */}
        </Modal.Footer>
      </Modal>
      <Row className="mt-5">
        <Col lg={12}>
          <Card>
            {/* <Card.Header>
                            <Card.Title className='d-flex justify-content-between'>
                            Company Document
                            
                            </Card.Title>
                            <button className="btn btn-primary" onClick={handleAdd}>
                                Add Document
                            </button>
                        </Card.Header> */}
            <ToastContainer />
            <Card.Body className="p-0">
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    <th scope="col">
                      <strong>Supplier</strong>
                    </th>
                    <th scope="col">
                      <strong>Service </strong>
                    </th>
                    <th scope="col">
                      <strong>Pax Range</strong>
                    </th>
                    <th scope="col">
                      <strong>Total Cost</strong>
                    </th>
                    <th scope="col">
                      <strong>Per Pax Cost</strong>
                    </th>
                    <th scope="col">
                      <strong>GST Slab</strong>
                    </th>
                    <th scope="col">
                      <strong>Child Cost</strong>
                    </th>
                    <th scope="col">
                      <strong>Remarks</strong>
                    </th>
                    <th scope="col">
                      <strong>Status</strong>
                    </th>
                    <th scope="col">
                      <strong>Action</strong>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rateInitialList?.map((item1) => {
                    return item1?.Data?.map((item2) => {
                      return item2?.RateDetails?.map((item) => {
                        return (
                          <tr key={item?.UniqueID}>
                            <td className="text-center">
                              {item?.SupplierName}
                            </td>
                            <td className="text-center">{item?.Service}</td>
                            <td className="text-center">{item?.PaxRange}</td>
                            <td className="text-center">{item?.TotalCost}</td>
                            <td className="text-center">{item?.PaxCost}</td>
                            <td className="text-center">{item?.TaxSlabName}</td>
                            <td className="text-center">{item?.ChildCost}</td>
                            <td className="text-center">{item?.Remarks}</td>
                            <td className="text-center">
                              {item?.Status == 1 ? "Active" : "Inactive"}
                            </td>
                            <td>
                              <span className="d-flex gap-1">
                                <i
                                  className="fa-solid fa-pencil cursor-pointer action-icon text-success"
                                  data-toggle="modal"
                                  data-target="#modal_form_vertical"
                                  onClick={() =>
                                    handleRateEdit(
                                      item,
                                      item1?.companyId,
                                      item1?.TransportId
                                    )
                                  }
                                ></i>
                                <i
                                  className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
                                  onClick={() =>
                                    handleRateDelete(
                                      item1?.ActivityId,
                                      item?.UniqueID
                                    )
                                  }
                                ></i>
                                <i className="fa-solid fa-eye  text-info ms-2 action-icon " onClick={() => view(item)}></i>
                              </span>
                            </td>
                          </tr>
                        );
                      });
                    });
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default React.memo(RateList);
