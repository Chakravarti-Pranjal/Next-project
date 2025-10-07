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
      const { data } = await axiosOther.post("deletetrainrate", {
        TrainId: primId,
        UniqueId: uniquId,
      });
      // console.log("delete-response", data);

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

  // console.log("rate-transport", rateInitialList);

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
                      <strong>Supplier Name</strong>
                    </th>
                    <th scope="col">
                      <strong>Train Name</strong>
                    </th>
                    <th scope="col">
                      <strong>Train Class</strong>
                    </th>
                    <th scope="col">
                      <strong>Journey Type</strong>
                    </th>
                    <th scope="col">
                      <strong>Currency</strong>
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
                            <td className="text-center">{item?.TrainNumber}</td>
                            <td className="text-center">
                              {item?.TrainClassName}
                            </td>
                            <td className="text-center">{item?.JourneyType}</td>
                            <td className="text-center">
                              {item?.CurrencyName}
                            </td>
                            <td className="text-center">{item?.AdultCost}</td>
                            <td className="text-center">{item?.ChildCost}</td>
                            <td className="text-center">{item?.InfantCost}</td>
                            <td className="text-center">{item?.Remarks}</td>
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
                                      item1?.TrainId,
                                      item1?.companyId
                                    )
                                  }
                                ></i>
                                <i
                                  className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
                                  onClick={() =>
                                    handleRateDelete(
                                      item?.UniqueID,
                                      item1?.TrainId
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
