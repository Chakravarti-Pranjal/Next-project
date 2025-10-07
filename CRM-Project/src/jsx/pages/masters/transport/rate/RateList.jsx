import React, { useState } from "react";
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
import Table from "react-bootstrap/Table";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifyError, notifySuccess } from "../../../../../helper/notify";
import { Modal } from 'react-bootstrap';
import PerfectScrollbar from "react-perfect-scrollbar";
import { useLocation } from "react-router-dom";

const RateList = ({
  setDataUpdate,
  setIsUpdating,
  rateInitialList,
  rateList,
}) => {
  const [centered, setcentered] = useState(false);
  const { state } = useLocation();
  const [Dataview, setDataview] = useState([]);
  const handleRateDelete = async (uniquId, primId) => {
    try {
      const { data } = await axiosOther.post("deletetransportrate", {
        TransportId: primId,
        UniqueId: uniquId,
      });
      // console.log("delete-response",data);

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

  const handleRateEdit = (value, companyId) => {
    setIsUpdating(true);
    setDataUpdate({
      ...value,
      RateUniqueId: value?.UniqueID,
      CompanyId: companyId,
      DestinationName: value?.DestinationName
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

  // console.log("rate-transport",rateInitialList);

  const view = (item) => {
    setcentered(true)
    setDataview(item.VehicleType)
    // console.log(item.VehicleType,"item.ServiceCost")
  };
  //  console.log({item.VehicleType},"item.VehicleType")
  return (
    <>
      <Modal show={centered} className="vehicle-details" onHide={() => setcentered(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Vehicle Details</Modal.Title>
        </Modal.Header>
        {/* <PerfectScrollbar> */}
        <Modal.Body>
          {Dataview.length > 0 ? (
            <Table striped bordered responsive>
              <thead>
                <tr>
                  <th>Vehicle Type</th>
                  {/* <th>No. of Vehicles</th> */}
                  <th>Vehicle  Cost</th>
                  <th>Parking Fee</th>
                  <th>Rap Entry Fee</th>
                  <th>Assistance</th>
                  <th>Additional Allowance</th>
                  <th>InterState Toll</th>
                  <th>Misc Cost</th>
                  <th>Total Cost</th>
                  <th>Grand Total</th>
                </tr>
              </thead>
              <tbody>
                {Dataview?.map((vehicle, index) => (
                  <tr key={index}>
                    <td>{vehicle.VehicleTypeName || "-"}</td>
                    {/* <td>{vehicle.NoOfVehicle || "-"}</td> */}
                    <td>{vehicle.VehicleCost || "-"}</td>
                    <td>{vehicle.ParkingFee || "-"}</td>
                    <td>{vehicle.RapEntryFee || "-"}</td>
                    <td>{vehicle.Assistance || "-"}</td>
                    <td>{vehicle.AdtnlAllowance || "-"}</td>
                    <td>{vehicle.InterStateToll || "-"}</td>
                    <td>{vehicle.MiscCost || "-"}</td>
                    <td>{vehicle.TotalCost || "-"}</td>
                    <td>{vehicle.GrandTotal || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">No records found!</p>
          )}
        </Modal.Body>
        {/* </PerfectScrollbar> */}
      </Modal>

      <Row className="mt-5">
        <Col lg={12}>
          <Card>
            <ToastContainer />
            <Card.Body className="p-0">
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    <th scope="col">
                      <strong>Transport Name</strong>
                    </th>
                    <th scope="col">
                      <strong>Type</strong>
                    </th>
                    <th scope="col">
                      <strong>Destination</strong>
                    </th>
                    <th scope="col">
                      <strong>Vehicle Type</strong>
                    </th>
                    <th scope="col">
                      <strong>Tax Slab</strong>
                    </th>
                    {/* <th scope="col">
                      <strong>Vehicle Cost</strong>
                    </th>
                    <th scope="col">
                      <strong>Parking</strong>
                    </th>
                    <th scope="col">
                      <strong>Representative Entry Fee</strong>
                    </th>
                    <th scope="col">
                      <strong>Assistance</strong>
                    </th>
                    <th scope="col">
                      <strong>Additional Allowance</strong>
                    </th>
                    <th scope="col">
                      <strong>Inter State & Toll</strong>
                    </th>
                    <th scope="col">
                      <strong>Miscellaneous Cost</strong> */}
                    {/* </th> */}
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
                        // console.log(item?.VehicleTypeName,"itesmss")
                        return (

                          <tr key={item?.UniqueID}>
                            <td className="text-center">
                              {/* {console.log(item,"item")} */}
                              {item1?.TransportName}
                              {/* {console.log()} */}
                            </td>
                            {/* <td className="text-center">{item?.Type}</td> */}
                            <td className="text-center">{state?.Name}</td>
                            <td className="text-center">
                              {item1?.DestinationName}
                              {/* {console.log(item?.DestinationName, "DestinationName")} */}
                            </td>
                            {/* <td className="text-center">
                              {item?.VehicleType?.map((veh) => (
                                <span key={veh.VehicleTypeId}>{veh.VehicleTypeName}</span>
                              ))}
                            </td> */}
                            <td className="text-center">
                              {item?.VehicleType?.map((veh) => veh.VehicleTypeName).join(', ')}
                            </td>

                            <td className="text-center">{item?.TaxSlabName}</td>
                            {/* <td className="text-center">{item?.VehicleCost}</td>
                            <td className="text-center">{item?.ParkingFee}</td>
                            <td className="text-center">{item?.RapEntryFee}</td>
                            <td className="text-center">{item?.Assistance}</td>
                            <td className="text-center">
                              {item?.AdtnlAllowance}
                            </td>
                            <td className="text-center">
                              {item?.InterStateToll}
                            </td>
                            <td className="text-center">{item?.MiscCost}</td> */}
                            <td
                              className={`text-center ${item?.Status == "1"
                                ? "text-success"
                                : "text-danger"
                                }`}
                            >
                              {item?.Status == "1" ? "Active" : "Inactive"}
                            </td>
                            <td>
                              <span className="d-flex gap-2 justify-content-center">
                                <i
                                  className="fa-solid fa-pencil cursor-pointer action-icon text-success"
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
                                      item?.UniqueID,
                                      item1?.TransportId
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
