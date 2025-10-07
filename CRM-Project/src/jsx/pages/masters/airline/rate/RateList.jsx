import React from "react";
import { Row, Card, Col } from "react-bootstrap";
import { axiosOther } from "../../../../../http/axios_base_url";
import "../../../../../scss/main.css";
import Table from "react-bootstrap/Table";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifyError, notifySuccess } from "../../../../../helper/notify";

const RateList = ({
  setDataUpdate,
  setIsUpdating,
  rateInitialList,
  rateList,
}) => {
  const handleRateDelete = async (uniquId, primId) => {
    try {
      const { data } = await axiosOther.post("deleteAirlineratejson", {
        AirlineId: primId,
        UniqueId: uniquId,
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

  const handleRateEdit = (value, companyId) => {
    setIsUpdating(true);
    setDataUpdate({
      ...value,
      CompanyId: companyId,
    });
  };

  return (
    <>
      <Row className="mt-5">
        <Col lg={12}>
          <Card>
            <ToastContainer />
            <Card.Body className="p-0">
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    <th scope="col">
                      <strong>Flght Number</strong>
                    </th>
                    <th scope="col">
                      <strong>Flight Class</strong>
                    </th>
                    <th scope="col">
                      <strong>Adult Cost</strong>
                    </th>
                    <th scope="col">
                      <strong>Child Cost</strong>
                    </th>

                    <th scope="col">
                      <strong>Infant Cost</strong>
                    </th>
                    <th scope="col">
                      <strong>Baggage Allowence</strong>
                    </th>
                    <th scope="col">
                      <strong>Cancellation Policy</strong>
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
                              {item?.FlightNumber}
                            </td>
                            <td className="text-center">
                              {item?.FlightClassName}
                            </td>
                            <td className="text-center">
                              <div className="d-flex gap-3">
                                <span className="font-weight-bold text-nowrap">
                                  Base Fare :
                                </span>
                                <span>{item?.AdultCost?.base_fare}</span>
                              </div>
                              <div className="d-flex gap-3">
                                <span className="font-weight-bold text-nowrap">
                                  Airline Tax :
                                </span>
                                <span>{item?.AdultCost?.airline_tax}</span>
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="d-flex gap-3">
                                <span className="font-weight-bold text-nowrap">
                                  Base Fare :
                                </span>
                                <span>{item?.ChildCost?.base_fare}</span>
                              </div>
                              <div className="d-flex gap-3">
                                <span className="font-weight-bold text-nowrap">
                                  Airline Tax :
                                </span>
                                <span>{item?.ChildCost?.airline_tax}</span>
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="d-flex gap-3">
                                <span className="font-weight-bold text-nowrap">
                                  Base Fare :
                                </span>
                                <span>{item?.InfantCost?.base_fare}</span>
                              </div>
                              <div className="d-flex gap-3">
                                <span className="font-weight-bold text-nowrap">
                                  Airline Tax :
                                </span>
                                <span>{item?.InfantCost?.airline_tax}</span>
                              </div>
                            </td>
                            <td className="text-center">
                              {item?.BaggageAllowance}
                            </td>
                            <td className="text-center">
                              {item?.CancellationPolicy}
                            </td>
                            <td className="text-center">{item?.Remarks}</td>
                            <td
                              className={`text-center ${item?.Status == 1
                                  ? "text-success"
                                  : "text-danger"
                                }`}
                            >
                              {item?.Status == 1 ? "Active" : "Inactive"}
                            </td>
                            <td>
                              <span className="d-flex gap-1">
                                <i
                                  className="fa-solid fa-pencil cursor-pointer action-icon text-success"
                                  data-toggle="modal"
                                  data-target="#modal_form_vertical"
                                  onClick={() =>
                                    handleRateEdit(item, item1?.CompanyId)
                                  }
                                ></i>
                                <i
                                  className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
                                  onClick={() =>
                                    handleRateDelete(
                                      item?.UniqueID,
                                      item1?.AirlineId
                                    )
                                  }
                                ></i>
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
